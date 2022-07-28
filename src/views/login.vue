<template>
  <div class="container">
    <div class="login-box">
      <div
        :class="['switch-btn', { 'icon-pwd': !pageType }]"
        @click="pageType = !pageType"
      ></div>
      <div class="pwd" v-show="pageType">
        <p>管理后台登录</p>
        <el-form ref="submitForm" :rules="rules" :model="form">
          <div class="label">工号</div>
          <el-form-item prop="staffCode">
            <el-input
              maxlength="8"
              v-model="form.staffCode"
              @keydown.enter="funLogin()"
              placeholder="请输入工号"
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <div class="label">密码</div>

          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="form.password"
              @keydown.enter="funLogin()"
              placeholder="请输入密码"
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <div class="forget">
            <div @click="showForgetDialog()"><i></i><span>忘记密码</span></div>
          </div>
        </el-form>
        <div class="submit-btn" @click="funLogin()">登录</div>
      </div>
      <div class="qrcode-box" v-show="!pageType">
        <p>手机钉钉扫码登录</p>
        <div id="qrcode"></div>
      </div>
    </div>
    <dialog-forget ref="dialogForget"></dialog-forget>
    <dialog-set-password ref="dialogSetPassword"></dialog-set-password>
  </div>
</template>
<script>
import dialogForget from "@/components/dialogForget.vue";
import dialogSetPassword from "@/components/dialogSetPassword.vue";
import { reactive, onMounted, toRefs, ref, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  components: {
    dialogForget,
    dialogSetPassword,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const dialogSetPassword = ref(null);
    const dialogForget = ref(null);
    const submitForm = ref(null);
    const _this = getCurrentInstance();
    const API = _this.proxy.$API;
    const data = reactive({
      pageType: true,
      STATE: new Date().getTime() + Math.floor(Math.random() * 999999),
      loginTmpCode: "",
      form: {
        staffCode: "",
        password: "",
      },
      rules: {
        staffCode: [{ required: true, message: "请输入工号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      redirectUri: `${window.location.origin}/#/login`,
    });
    onMounted(() => {
      // if (typeof window.addEventListener != "undefined") {
      //   window.addEventListener("message", handleMessage, false);
      // } else if (typeof window.attachEvent != "undefined") {
      //   window.attachEvent("onmessage", handleMessage);
      // }
      // /*
      //  * 解释一下goto参数，参考以下例子：
      //  * var url = encodeURIComponent('http://localhost.me/index.php?test=1&aa=2');
      //  * var goto = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=SuiteKey&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+url)
      //  */
      // //注意:后面的redirect_uri要用encodeURIComponent处理一下
      // let goto = encodeURIComponent(
      //   `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${import.meta.env.VUE_APP_DING_APP_ID
      //   }&response_type=code&scope=snsapi_login&state=${data.STATE
      //   }&redirect_uri=${encodeURIComponent(data.redirectUri)}`
      // );
      // window.DDLogin({
      //   id: "qrcode", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
      //   goto: goto, //请参考注释里的方式
      //   style: "border:none;background-color:#FFFFFF;",
      //   width: "365",
      //   height: "400",
      // });
      // //扫码登录
      // if (route.query.code && !route.query.redirect_uri) {
      //   console.log('dingLogin')
      //   API.login
      //     .dingLogin({
      //       tmpAuthCode: route.query.code,
      //     })
      //     .then((res) => {
      //       if (res.data.code === 200) {
      //         window.sessionStorage.setItem("staffCode", res.data.data.staffCode);
      //         if (res.data.data.isFirstLogin) {
      //           dialogSetPassword.value.show({
      //             staffCode: res.data.data.staffCode,
      //             isSelect: res.data.data.isSelect,
      //           });
      //         } else {
      //           if (res.data.data.isSelect === "1") {
      //             router.push({
      //               name: "AccountType",
      //               query: {
      //                 params: JSON.stringify({
      //                   ...data.form,
      //                   loginMode: "1",
      //                 }),
      //               },
      //             });
      //           } else {
      //             toHome({
      //               staffCode: res.data.data.staffCode,
      //               loginMode: "1",
      //             });
      //           }
      //         }
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
    });
    const showForgetDialog = () => {
    console.log(dialogForget.value)
      dialogForget.value.show();
    };
    const toHome = (params) => {
      params = {
        ...params,
        type: 2,
      };
      API.login.login(params).then(async ({ data }) => {
        console.log(data);
        await localStorage.setItem("adminToken", data.data);
        getBtn();
        getInfo();
      });
    };
    const funLogin = () => {
      submitForm.value.validate((valid) => {
        if (valid) {
          let params = {
            ...data.form,
            loginMode: 2,
          };
          API.login.checkLogin(params).then(async ({ data }) => {
            console.log(data);
            if (data.data.isSelect == 0) {
              toHome(params);
            } else {
              router.push({
                name: "AccountType",
                query: {
                  params: JSON.stringify(params),
                },
              });
            }
          });
        } else {
          return false;
        }
      });
    };
    const getBtn = () => {
      API.login.getCurrentUserBut().then(({ data }) => {
        console.log(data);
        localStorage.setItem("permissions", JSON.stringify(data.data));
      });
    };
    const getInfo = () => {
      API.login.getCurrentUser().then(({ data }) => {
        console.log(data);
        localStorage.setItem(
          "menuList",
          JSON.stringify(data.data.permissionList)
        );
        let userInfo = {
          staffName: data.data.staffName,
        };
        localStorage.setItem("adminUser", JSON.stringify(userInfo));
        router.push("/");
      });
    };
    const handleMessage = (event) => {
      //获取loginTmpCode
      let origin = event.origin;
      if (origin == "https://login.dingtalk.com") {
        //判断是否来自ddLogin扫码事件。
        data.loginTmpCode = event.data;
        //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
        window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${
          import.meta.env.VUE_APP_DING_APP_ID
        }&response_type=code&scope=snsapi_login&state=${
          data.STATE
        }&redirect_uri=${encodeURIComponent(data.redirectUri)}&loginTmpCode=${
          data.loginTmpCode
        }`;
      }
    };
    return {
      ...toRefs(data),
      dialogSetPassword,
      dialogForget,
      submitForm,
      showForgetDialog,
      toHome,
      funLogin,
      getBtn,
      getInfo,
      handleMessage,
    };
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #132c78;

  .login-box {
    width: 504px;
    height: 465px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;

    .switch-btn {
      position: absolute;
      width: 64px;
      height: 66px;
      top: 0;
      right: 0;
      background: url("../assets/img/icon-qrcode.png") 0 0 no-repeat;
      background-size: cover;
      cursor: pointer;
    }

    .icon-pwd {
      background: url("../assets/img/icon-pwd.png") 0 0 no-repeat;
      background-size: cover;
    }

    .pwd {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 42px 86px 44px;

      p {
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 26px;
      }

      .label {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        margin-bottom: 10px;
      }

      .submit-btn {
        width: 320px;
        height: 45px;
        background: #4372fd;
        border-radius: 4px;
        text-align: center;
        line-height: 45px;
        color: #fff;
        cursor: pointer;
      }
    }

    .qrcode-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 50px;

      p {
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 20px;
      }
    }

    .forget {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      margin-bottom: 32px;

      div {
        cursor: pointer;
        display: flex;
        align-items: center;

        i {
          width: 16px;
          height: 16px;
          background: url("../assets/img/icon-question.png") 0 0 no-repeat;
          background-size: cover;
          margin-right: 4px;
        }

        span {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
}
</style>
