import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'App',
    component: () => import('../App.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home/:session',
    name: 'Home',
    props: true,
    component: () => import('../components/Home.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
