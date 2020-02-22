// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import FastClick from 'fastclick'
import {LoadingPlugin} from 'vux'
import 'lib-flexible/flexible'
import {setCookie,getCookie,delCookie} from './assets/cookie'
Vue.use(LoadingPlugin);
Vue.config.productionTip = false;
axios.interceptors.request.use(function (config) {
  config.headers = {'TOKEN': JSON.parse(localStorage.getItem('token'))};
  return config;
}, function (error) {
  return Promise.reject(error);
});
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response) {
    console.log(error)
    switch (error.response.status) {
      case 401:
        //delCookie( 'TOKEN' );//删除
        // 返回 401 清除token信息并跳转到登录页面
        localStorage.removeItem('token');
        // router.replace({
        //   path: '/',
        //   query: {redirect: router.currentRoute.fullPath}
        // })'
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf9db3d166e257b76&redirect_uri=http://tmmy.guokaizhengxin.com/oAuth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    }
  }
  return Promise.reject(error);
});
;
Vue.prototype.$axios = axios;
/**
 *  点击延迟
 */
FastClick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
