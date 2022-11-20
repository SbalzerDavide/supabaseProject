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
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    props: true,
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'notes',
        component: () => import('../views/Notes.vue'),
        children: [
          {
            path: 'new',
            component: () => import('../views/note/NewNote.vue'),
          },
          {
            path: 'list',
            component: () => import('../views/note/NotesList.vue'),
          },
          {
            path: 'show',
            name: 'ShowNote',
            props: true,
            component: () => import('../views/note/ShowNote.vue'),
          },
        ],    
      },
      {
        path: "manageFood",
        component: () => import('../views/ManageFood.vue'),
        children: [
          {
            path: 'new',
            name: "NewFood",
            component: () => import('../views/manageFood/NewFood.vue'),
          },
        ],    
      }
    ],
  },
]

const router = new VueRouter({
  routes
})

export default router
