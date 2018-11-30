// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import {routers} from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css'
import VueRouter from 'vue-router'
import {validForm} from './utils/utils'
import tableList from './components/tableList'

Vue.component('tableList', tableList)
Vue.use(VueRouter)
Vue.use(iView)
Vue.prototype.$validForm = validForm
Vue.prototype.$axios = axios
Vue.config.productionTip = false
const routeConfig = {
  mode: 'history',
  routes : routers
}

const router = new VueRouter(routeConfig)
// 每次路由跳转到的时候都会调用该函数
router.beforeEach((to, from, next) => { //beforeEach是router的钩子函数，在进入路由前执行
  // to即将进入的目标路由对象， from当前导航正要离开的路由，next下一步执行的函数钩子
  // console.log("to", to)
  // console.log("from", from)
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // console.log("sessionStorage.getItem('accessToken')=", sessionStorage.getItem('accessToken'))
  // frame组件页面 所以直接让它跳到登录页
  if(to.path === "/menu/index"){
    next({ path: '/login' })
  }
  // console.log("window.localStorage.getItem('accessToken')==", window.localStorage.getItem('accessToken'), "to.meta.requiresAuth=", to.meta.requiresAuth)
  // 如果不是登录页
  if(to.path !== "/login"){
    // 验证自定义页面权限 和 是否有登录的session信息
    // 没通过 跳到登录页面
    if(to.meta.requiresAuth && !sessionStorage.getItem('accessToken')) {
      next({ path: '/login' })
    } else {
      // 登录成功后 给meta赋予一个权限判断值
      to.meta.userType = sessionStorage.getItem('type')
      if(to.path === '/menu/index/staff' || to.path === '/menu/index/staffDetail'){
        if(to.meta.userType!== 'admin'){
          alert('没有员工管理页面的操作权限！')
          // 返回上一页
          window.history.go(-1)
        }
      }
      next()
    }
  }

  // 登录页放行
  next()
})
axios.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,\'Origin\',Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      next();
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
