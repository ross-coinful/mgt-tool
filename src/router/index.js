import Vue from 'vue'
import Router from 'vue-router'
import VueDoc from '@/components/VueDoc'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/vuedoc',
      name: 'VueDoc',
      component: VueDoc
    }
  ]
})
