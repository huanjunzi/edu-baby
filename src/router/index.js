
export const menu = [
  { path: '/', redirect: '/login' }, // 默认就跳转此页面
  {
    path: '/menu/index',
    name: 'menu',
    component:() => import('../components/menu.vue'),
    children: [
      // 懒加载
      { path: 'classes', meta: {title: '课程项目'}, name: 'classes', component: resolve => require(['../education/index.vue'], resolve) }
    ]
  },
]

export const loginUser = [
{
  path: '/login',
  name: 'login',
  component:() => import('../login/login.vue')
},
]

export const notFound = {
  path: '/*',
  name: 'error-404',
  meta: {
      title: '404-页面不存在'
  },
  component:() => import('../components/404.vue')
}



export const routers = [
    ...loginUser,
    ...menu,
    notFound,
]
