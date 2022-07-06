<template>
  <el-dialog title="忘记密码" v-model="dialogVisible" width="40%" center>
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="30%">
        <el-form-item label="工号:" prop="staffCode">
          <el-input
            v-model="form.staffCode"
            placeholder="请输入"
            size="small"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="smsCode">
          <div class="input-box">
            <el-input
              v-model="form.smsCode"
              placeholder="请输入"
              size="small"
              class="input"
              style="width: 200px"
            ></el-input>
            <div class="btn" v-if="!showSecond" @click="funGetCode()">
              获取验证码
            </div>
            <div class="second" v-if="showSecond">{{ second }}s</div>
          </div>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            @keyup="clearValidate('newPassword')"
            placeholder="请输入"
            size="small"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码确认:" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            placeholder="请输入"
            type="password"
            size="small"
            class="input"
            @keyup="clearValidate('confirmPassword')"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          style="background: linear-gradient(to bottom, #1a4aa6, #0b246d)"
          type="primary"
          @click="funSubmit()"
          >提 交</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { codeRule } from "@/utils/utils.js";
export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.confirmPassword !== value && this.form.confirmPassword) {
          callback(new Error("两次输入密码不一致"));
        } else if (value.length < 8) {
          callback(new Error("密码长度需至少为8位"));
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.newPassword !== value && this.form.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else if (value.length < 8) {
          callback(new Error("密码长度需至少为8位"));
        }
        callback();
      }
    };
    return {
      form: {
        staffCode: "",
        smsCode: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        staffCode: [
          { required: true, message: "请输入工号", trigger: "blur" },
          {
            validator: codeRule,
            trigger: "blur",
          },
        ],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        newPassword: [{ required: true, validator: validatePass1 }],
        confirmPassword: [{ required: true, validator: validatePass2 }],
      },
      dialogVisible: false,
      timer: null,
      second: 60,
      showSecond: false,
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    this.showSecond = false;
  },
  methods: {
    clearValidate(name) {
      if (this.form.newPassword === this.form.confirmPassword) {
        this.$refs.form.clearValidate(name);
      }
    },
    funGetCode() {
      if (!this.form.staffCode) {
        this.$message.error("请填写工号");
      } else {
        this.$api.login
          .sendSmsMessage({ staffCode: this.form.staffCode })
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("验证码发送成功");
              this.showSecond = true;
              console.log(this.showSecond);
              this.timer = setInterval(() => {
                this.second--;
                console.log(this.second);
                if (this.second < 0) {
                  clearInterval(this.timer);
                  this.timer = null;
                  this.second = 60;
                  this.showSecond = false;
                }
              }, 1000);
            }
          });
      }
    },
    funSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.login.resetPassword(this.form).then((res) => {
            if (res.data.code === 200) {
              clearInterval(this.timer);
              this.timer = null;
              this.second = 60;
              this.hide();
              this.$message.success("修改成功！");
            }
          });
        } else {
          return false;
        }
      });
    },
    show() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    hide() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.input {
  width: 320px;
}
.input-box {
  display: flex;
  align-items: center;
  .btn {
    font-size: 10px;
    color: #0f2f8e;
    margin-left: 8px;
    cursor: pointer;
  }
  .second {
    font-size: 10px;
    color: rgba(0, 0, 0, 0.65);
    margin-left: 8px;
  }
}
</style>
