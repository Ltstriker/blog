import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import blog from '@/components/blog'
import editblog from '@/components/editblog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/blog/:id',
      name: 'blog',
      component: blog
    },
    {
      path: '/editblog/:id/:state',
      name: 'editblog',
      component: editblog
    }
  ]
})
