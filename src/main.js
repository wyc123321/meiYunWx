// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import FastClick from 'fastclick'
import  { LoadingPlugin } from 'vux'
import 'lib-flexible/flexible'
Vue.use(LoadingPlugin);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
/**
 *  点击延迟
 */
FastClick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
