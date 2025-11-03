import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/index.vue'
import ApplicationForm from '@/views/application/create.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'titles.home' }, // translation key
  },
  {
    path: '/application',
    name: 'ApplicationForm',
    component: ApplicationForm,
    meta: { title: 'titles.applicationForm' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
