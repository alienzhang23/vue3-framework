<template>
  <el-dialog
    title="设置密码"
    v-model="dialogVisible"
    width="35%"
    center
    @close="hide()"
  >
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="30%">
        <el-form-item label="工号:">
          <div>{{ form.staffCode }}</div>
        </el-form-item>

        <el-form-item label="新密码:" prop="newPassword">
          <el-input
            v-model.trim="form.newPassword"
            type="password"
            placeholder="请输入"
            size="small"
            class="input"
            style="width: 200px"
            @keyup="clearValidate('newPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码确认:" prop="confirmPassword">
          <el-input
            v-model.trim="form.confirmPassword"
            type="password"
            placeholder="请输入"
            size="small"
            class="input"
            @keyup="clearValidate('confirmPassword')"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="funSubmit()">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
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
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        newPassword: [{ required: true, validator: validatePass1 }],
        confirmPassword: [{ required: true, validator: validatePass2 }],
      },
      isSelect: "",
      dialogVisible: false,
    };
  },
  methods: {
    clearValidate(name) {
      if (this.form.newPassword === this.form.confirmPassword) {
        this.$refs.form.clearValidate(name);
      }
    },
    funSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.login.setUpPassword(this.form).then((res) => {
            if (res.data.code === 200) {
              if (this.isSelect === "1") {
                this.$router.push({
                  name: "AccountType",
                  query: {
                    params: JSON.stringify({
                      staffCode: this.form.staffCode,
                      password: this.form.newPassword,
                      loginMode: "1",
                    }),
                  },
                });
              } else {
                this.hide();
                this.$message.success("设置成功!");
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    show(data) {
      this.dialogVisible = true;
      this.form.staffCode = data.staffCode;
      this.isSelect = data.isSelect;
      this.dialogVisible = true;
    },
    hide() {
      window.location.href = `${window.location.origin}/#/login`;
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.input {
  width: 350px;
}
</style>
