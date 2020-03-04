import Vue from 'vue'
import VueRouter from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: BasicLayout
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   //webpackPrefetch 是否开启预加载组件
  //   component: () => import(/* webpackChunkName: "about" */ /* webpackPrefetch: false  */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
