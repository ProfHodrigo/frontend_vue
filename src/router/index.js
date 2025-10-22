import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import BlogList from '@/views/BlogList.vue'
import BlogPost from '@/views/BlogPost.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import AdminPosts from '@/views/admin/AdminPosts.vue'
import PostForm from '@/components/admin/PostForm.vue'
import AdminCategories from '@/views/admin/AdminCategories.vue'
import CategoryForm from '@/components/admin/CategoryForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: BlogList
  },
  {
    path: '/blog/category/:slug', // Rota para filtrar por categoria
    name: 'BlogListCategory',
    component: BlogList, // Reutiliza o MESMO componente
    props: true // Passa o :slug como uma prop para o componente
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: BlogPost,
    props: true
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: AdminHome
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: AdminPosts
      },
      {
        path: 'posts/new',
        name: 'AdminPostNew',
        component: PostForm
      },
      {
        path: 'posts/:id/edit',
        name: 'AdminPostEdit',
        component: PostForm,
        props: true
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories
      },
      {
        path: 'categories/new',
        name: 'AdminCategoryNew',
        component: CategoryForm
      },
      {
        path: 'categories/:id/edit',
        name: 'AdminCategoryEdit',
        component: CategoryForm,
        props: true // <-- Essencial para passar o ID como prop!
      }
    ],
    beforeEnter: (to, from, next) => {
      // Simples simulação de autenticação
      const isAuthenticated = localStorage.getItem('isAdmin')
      if (isAuthenticated) {
        next()
      } else {
        next('/')
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router