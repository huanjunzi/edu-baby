
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
      { path: 'member', meta: {title: '家长管理', requiresAuth: true }, name: 'member', component: resolve => require(['../member/index.vue'], resolve) },
      { path: 'memberDetail', meta: {title: '家长详情', requiresAuth: true }, name: 'memberDetail', component: resolve => require(['../member/memberDetail.vue'], resolve)},
      { path: 'child', meta: {title: '儿童管理', requiresAuth: true }, name: 'child', component: resolve => require(['../child/index.vue'], resolve) },
      { path: 'childDetail', meta: {title: '儿童详情', requiresAuth: true }, name: 'childDetail', component: resolve => require(['../child/childDetail.vue'], resolve) },
      { path: 'staff', meta: {title: '员工管理', requiresAuth: true }, name: 'staff', component: resolve => require(['../staff/index.vue'], resolve) },
      { path: 'staffDetail', meta: {title: '员工详情', requiresAuth: true }, name: 'staffDetail', component: resolve => require(['../staff/staffDetail.vue'], resolve) },
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

export const loveBerry = {
  path: '/loveberry',
  name: 'loveberry',
  meta: {
    title: 'Guess what this is'
  },
  component:() => import('../components/loveberry.vue')
}

export const routers = [
    loginUser,
    ...menu,
    notFound,
    loveBerry,
]
