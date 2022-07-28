<template>
  <el-dialog
    title="设置密码"
    v-model="dialogVisible"
    width="35%"
    center
    @close="hide()"
  >
    <div>
      <el-form ref="submitForm" :rules="rules" :model="form" label-width="30%">
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
import { ElMessage } from 'element-plus'
import { reactive, onMounted,  toRefs, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
  const submitForm = ref(null);
   const _this = getCurrentInstance();
    const API = _this.proxy.$API;
      const router = useRouter();
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
    const data=reactive({
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
    })
    onMounted(()=>{})
     const clearValidate=(name)=> {
      if (data.form.newPassword === data.form.confirmPassword) {
        submitForm.value.clearValidate(name);
      }
    }
    const funSubmit=()=> {
      submitForm.value.validate((valid) => {
        if (valid) {
          API.login.setUpPassword(data.form).then((res) => {
            if (res.data.code === 200) {
              if (data.isSelect === "1") {
                router.push({
                  name: "AccountType",
                  query: {
                    params: JSON.stringify({
                      staffCode: data.form.staffCode,
                      password: data.form.newPassword,
                      loginMode: "1",
                    }),
                  },
                });
              } else {
                hide();
                ElMessage.success("设置成功!");
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
    const show=(data)=> {
      data.dialogVisible = true;
      data.form.staffCode = data.staffCode;
      data.isSelect = data.isSelect;
      data.dialogVisible = true;
    }
    const hide=()=> {
      window.location.href = `${window.location.origin}/#/login`;
      data.dialogVisible = false;
    }
    return {
      ...toRefs(data),
      clearValidate,
      funSubmit,
      show,
      hide
    };
  },
 
};
</script>
<style lang="less" scoped>
.input {
  width: 350px;
}
</style>
