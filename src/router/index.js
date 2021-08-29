import { createRouter, createWebHistory } from 'vue-router'
import LinkList from '../components/LinkList'
import LinkForm from '../components/LinkForm'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LinkList
  },
  {
    path: '/create',
    name: 'Create New Link',
    component: LinkForm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
