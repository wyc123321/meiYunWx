<template>
  <div class="loginWarp">
    <img src="../../../static/img/meiLogo.png" alt="" class="logo">
    <div>
      <div class="loginItem" @click="foucs('email')">
        <i><img src="../../../static/img/email.png" alt=""></i>
        <input type="text" v-model="formData.email" ref="email" placeholder="邮箱">
      </div>
      <div class="loginItem" @click="foucs('password')">
        <i><img src="../../../static/img/password.png" alt=""></i>
        <input type="password" v-model="formData.password" ref="password" placeholder="密码">
      </div>
      <div class="loginItem" @click="foucs('captchaCode')">
        <i><img src="../../../static/img/yanzhen.png" alt=""></i>
        <input type="text" v-model="formData.captchaCode" ref="captchaCode" placeholder="验证码">
        <img :src="imgSrc" alt="" class="code" @click="getCode">
      </div>
    </div>
    <button class="loginBTn" @click="login">
      登录
    </button>
    <toast v-model="showPositionValue" type="text" width="15em" :time="1500" is-show-mask :text="message"
           position="top"></toast>
  </div>
</template>

<script>
  import {CheckIcon, Loading, Toast} from 'vux'

  export default {
    name: "login",
    components: {
      CheckIcon,
      Loading,
      Toast
    },
    data() {
      return {
        message: '',
        showPositionValue: false,
        formData: {
          "captchaCode": "",
          "captchaId": "",
          "email": "",
          "password": ""
        },
        imgSrc:require('../../../static/img/yanzhen.png')
      }
    },
    methods: {
      change(val, label) {
        console.log('change', val, label)
      },
      async login() {
        let email = this.formData.email.replace(/\s+/g, "");
        let password = this.formData.password.replace(/\s+/g, "");
        let captchaCode = this.formData.captchaCode.replace(/\s+/g, "");
        if (!email) {
          this.showPositionValue = true;
          this.message = '邮箱不能为空';
          return;
        } else if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
          this.showPositionValue = true;
          this.message = '请输入正确的邮箱';
          return;
        } else if (!password) {
          this.showPositionValue = true;
          this.message = '密码不能为空';
          return;
        } else if (!captchaCode) {
          this.showPositionValue = true;
          this.message = '验证码不能为空';
          return;
        }
        this.$vux.loading.show({
          text: '登录中...'
        });
        //登录注册相关接口不能带token，所以单独处理
        var instance = this.$axios.create({
          headers: {'Content-Type': 'application/json'}
        });
        await instance.post(process.env.API_BASE + 'login', this.formData)
          .then((response) => {
            if (response.status=='200') {
              window.localStorage.setItem('token', JSON.stringify(response.data));
              window.localStorage.setItem('user', JSON.stringify(this.formData));
              this.$router.replace({path: '/my'});
            } else {
              this.$message.error(response.data);
            }
          })
          .catch( async (error) => {
            if (error.response) {
              this.showPositionValue = true;
              this.message = error.response.data;
              await this.getCode()
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
           this.$vux.loading.hide();
      },
      foucs(ref) {
        this.$refs[ref].focus();
      },
      async getCode() {
        var instance = this.$axios.create({
          headers: {'Content-Type': 'application/json'}
        });
        await instance.get(process.env.API_BASE + 'common/getCaptcha?date='+Date.now())
          .then((response) => {
            if (response.status=='200') {
              this.imgSrc = response.data.base64Code;
              this.formData.captchaId = response.data.key;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            // console.log(error);
          });
      }
    },
    async created() {
      await this.getCode()
    }
  }
</script>

<style scoped>
  .loginWarp {
    width: 100%;
    height: 100%;
    background: url("../../../static/img/loginBack.png") no-repeat;
    background-size: 100% 100%;
    padding: 160px 60px 0;
    box-sizing: border-box;
  }

  .logo {
    display: block;
    width: 249px;
    height: 55px;
    margin: 0px auto 153px;
  }

  .loginBTn {
    height: 96px;
    background: rgba(0, 98, 211, 1);
    border-radius: 4px;
    margin: 0 auto;
    outline: none;
    border: none;
    color: white;
    text-align: center;
    line-height: 96px;
    cursor: pointer;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    display: block;
    width: 100%;
  }

  .loginItem {
    height: 96px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 14px 0px rgba(91, 115, 249, 0.17);
    border-radius: 10px;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
    position: relative;
  }

  .loginItem input {
    font-size: 20px;
    height: 100%;
    outline: none;
    border: none;
    width: 100%;
    padding-left: 35px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(95, 93, 112, 0.6);
    line-height: 96px;
  }

  .loginItem i {
    position: absolute;
    top: 34px;
  }

  .loginItem i img {
    width: 28px;
    height: 28px;
  }

  .code {
    position: absolute;
    width: 146px;
    height: 60px;
    right: 24px;
    cursor: pointer;
  }
</style>
