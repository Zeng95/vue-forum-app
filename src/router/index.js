import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'Store/index'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/PageHome')
    },

    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/PageSignup'),
      meta: { requiresGuest: true }
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/PageLogin'),
      meta: { requiresGuest: true }
    },

    {
      path: '/me',
      name: 'Profile',
      component: () => import('@/views/PageProfile'),
      props: false,
      meta: { requiresAuth: true }
    },

    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: () => import('@/views/PageProfile'),
      props: { edit: true },
      meta: { requiresAuth: true }
    },

    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: () => import('@/views/PageThreadCreate'),
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/thread/edit/:threadId',
      name: 'ThreadEdit',
      component: () => import('@/views/PageThreadEdit'),
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/category/:categoryId',
      name: 'Category',
      component: () => import('@/views/PageCategory'),
      props: true
    },

    {
      path: '/forum/:forumId',
      name: 'Forum',
      component: () => import('@/views/PageForum'),
      props: true
    },

    {
      path: '/thread/:threadId',
      name: 'ThreadShow',
      component: () => import('@/views/PageThreadShow'),
      props: true
    },

    {
      path: '/logout',
      name: 'Logout',
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        console.log('logout')
        store.dispatch('auth/logout').then(() => next({ name: 'Home' }))
      }
    },

    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/views/PageNotFound')
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  store.dispatch('auth/initAuthentication').then(user => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      console.log(user)
      if (user) {
        next()
      } else {
        if (to.path.includes('logout')) {
          next({ name: 'Login' })
        } else {
          // Query parameter
          next({ name: 'Login', query: { redirect: to.path } })
        }
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      user ? next({ name: 'Home' }) : next()
    } else {
      next() // Make sure to always call next()!
    }
  })
})

export default router
