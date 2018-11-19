
export const menu = [
  { path: '/', redirect: '/login' }, // 默认就跳转此页面
  {
    path: '/menu/index',
    name: 'menu',
    meta: {title: '首页'},
    component:() => import('../components/menu.vue'),
    children: [
      // 懒加载
      // 在需要登录验证的路由元信息里加入登录验证标识requiresAuth（自定义）某些开放页面例如404就不需要加
      { path: 'class', meta: {title: '课程项目', requiresAuth: true }, name: 'class', component: resolve => require(['../education/index.vue'], resolve) },
      { path: 'class_create', meta: {title: '新建课程项目', requiresAuth: true }, name: 'class_create', component: resolve => require(['../education/classCreate.vue'], resolve) },
      { path: 'member', meta: {title: '会员管理', requiresAuth: true }, name: 'member', component: resolve => require(['../member/index.vue'], resolve) },
      { path: 'memberDetail', meta: {title: '会员详情', requiresAuth: true }, name: 'memberDetail', component: resolve => require(['../member/memberDetail.vue'], resolve)},
    ]
  },
]

export const loginUser = 
{
  path: '/login',
  name: 'login',
  meta: {title: '登录页面'},
  component:() => import('../login/login.vue')
}

export const notFound = {
  path: '*',
  name: 'error-404',
  meta: {
      title: '404-页面不存在'
  },
  component:() => import('../components/404.vue')
}


export const routers = [
    loginUser,
    ...menu,
    notFound,
]
