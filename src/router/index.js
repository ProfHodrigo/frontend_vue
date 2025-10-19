import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/sobre',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/usuario/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router