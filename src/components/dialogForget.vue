<template>
  <el-dialog title="忘记密码" v-model="dialogVisible" width="40%" center>
    <div>
      <el-form ref="submitForm" :rules="rules" :model="form" label-width="30%">
        <el-form-item label="工号:" prop="staffCode">
          <el-input v-model="form.staffCode" placeholder="请输入" size="small" class="input"></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="smsCode">
          <div class="input-box">
            <el-input v-model="form.smsCode" placeholder="请输入" size="small" class="input" style="width: 200px">
            </el-input>
            <div class="btn" v-if="!showSecond" @click="funGetCode()">
              获取验证码
            </div>
            <div class="second" v-if="showSecond">{{ second }}s</div>
          </div>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" @keyup="clearValidate('newPassword')" placeholder="请输入"
            size="small" class="input"></el-input>
        </el-form-item>
        <el-form-item label="新密码确认:" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" placeholder="请输入" type="password" size="small" class="input"
            @keyup="clearValidate('confirmPassword')"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" style="background: linear-gradient(to bottom, #1a4aa6, #0b246d)" type="primary"
          @click="funSubmit()">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ElMessage } from 'element-plus'
import { reactive, onMounted, onBeforeUnmount, toRefs, ref, getCurrentInstance, nextTick } from "vue";

export default {
  setup() {
    const submitForm = ref(null);
    const _this = getCurrentInstance();
    const API = _this.proxy.$API;
    const validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (data.form.confirmPassword !== value && data.form.confirmPassword) {
          callback(new Error("两次输入密码不一致"));
        } else if (value.length < 8) {
          callback(new Error("密码长度需至少为8位"));
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (data.form.newPassword !== value && data.form.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else if (value.length < 8) {
          callback(new Error("密码长度需至少为8位"));
        }
        callback();
      }
    };
    const data = reactive({
      form: {
        staffCode: "",
        smsCode: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        staffCode: [
          { required: true, message: "请输入工号", trigger: "blur" },
        ],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        newPassword: [{ required: true, validator: validatePass1 }],
        confirmPassword: [{ required: true, validator: validatePass2 }],
      },
      dialogVisible: false,
      timer: null,
      second: 60,
      showSecond: false,
    })
    onMounted(() => { })
    onBeforeUnmount(() => {
      clearInterval(data.timer);
      data.timer = null;
      data.showSecond = false;
    })
    const clearValidate = (name) => {
      if (data.form.newPassword === data.form.confirmPassword) {
        submitForm.value.clearValidate(name);
      }
    }
    const funGetCode = () => {
      if (!data.form.staffCode) {
        ElMessage.error("请填写工号");
      } else {
        API.login
          .sendSmsMessage({ staffCode: data.form.staffCode })
          .then((res) => {
            if (res.data.code === 200) {
              ElMessage.success("验证码发送成功");
              data.showSecond = true;
              data.timer = setInterval(() => {
                data.second--;
                if (data.second < 0) {
                  clearInterval(data.timer);
                  data.timer = null;
                  data.second = 60;
                  data.showSecond = false;
                }
              }, 1000);
            }
          });
      }
    }
    const funSubmit = () => {
      submitForm.value.validate((valid) => {
        if (valid) {
          API.login.resetPassword(data.form).then((res) => {
            if (res.data.code === 200) {
              clearInterval(data.timer);
              data.timer = null;
              data.second = 60;
              data.hide();
              ElMessage.success("修改成功！");
            }
          });
        } else {
          return false;
        }
      });
    }
    const show = () => {
      data.dialogVisible = true;
      nextTick(() => {
        submitForm.value.resetFields();
      });
    }
    const hide = () => {
      data.dialogVisible = false;
    }
    return {
      ...toRefs(data),
      submitForm,
      clearValidate,
      funGetCode,
      funSubmit,
      show,
      hide
    };
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
