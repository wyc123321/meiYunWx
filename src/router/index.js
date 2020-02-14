import Vue from 'vue'
import Router from 'vue-router';
import Login from '../components/login/login';
import Home from '../components/home/home.vue';
import My from '../components/my/my.vue';
// const My = () => import('../components/my/my.vue');
// const Report = () => import('../components/report/report.vue');
/**
 *  配置滚动条的位置
 *  通过这个这个属性（是个函数），可以让应用像浏览器的原生表现那样，在按下 后退/前进 按钮时，简单地让页面滚动到顶部或原来的位置。
 */
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return {x: 0, y: 0}
  }
}
Vue.use(Router);

const router = new Router({
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {title: '一诺快记客户查账系统'}
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {title: '首页', showFooter: true}
    },
    {
      path: '/my',
      name: 'My',
      component: My,
      meta: {title: '我的企业'}
    },
    {
      path: '*',
      redirect: '/',
    },
  ]
});
/**
 *  修改网站title的值
 */
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
/**
 * 路由拦截器
 * 1.判断该路由是否需要登录权限
 * 2.通过vuex state获取当前的token是否存在
 * 3.将跳转的路由path作为参数，登录成功后跳转到该路由
 */
router.beforeEach((to, from, next) => {
  next()
})
/**
 * 路由输出
 */
export default router
