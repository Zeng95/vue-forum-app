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
      component: () => import('Views/PageHome')
    },

    {
      path: '/register',
      name: 'Signup',
      component: () => import('Views/PageSignUp'),
      meta: { requiresGuest: true }
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('Views/PageLogIn'),
      meta: { requiresGuest: true }
    },

    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: (to, from, next) => {
        store.dispatch('auth/logout').then(() => {
          next({ name: 'Home', query: { redirect: Date.now() } })
        })
      },
      meta: { requiresAuth: true }
    },

    {
      path: '/me',
      name: 'Profile',
      component: () => import('Views/PageProfile'),
      props: false,
      meta: { requiresAuth: true }
    },

    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: () => import('Views/PageProfile'),
      props: { edit: true },
      meta: { requiresAuth: true }
    },

    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: () => import('Views/PageThreadCreate'),
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/thread/edit/:threadId',
      name: 'ThreadEdit',
      component: () => import('Views/PageThreadEdit'),
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/category/:categoryId',
      name: 'Category',
      component: () => import('Views/PageCategory'),
      props: true
    },

    {
      path: '/forum/:forumId',
      name: 'Forum',
      component: () => import('Views/PageForum'),
      props: true
    },

    {
      path: '/thread/:threadId',
      name: 'ThreadShow',
      component: () => import('Views/PageThreadShow'),
      props: true
    },

    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/views/PageNotFound')
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.dispatch('auth/initAuthentication').then(user => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (user) {
        next()
      } else {
        if (to.name === 'Logout') {
          next({ name: 'Login' })
        } else {
          // Query parameter
          next({ name: 'Login', query: { redirect: from.path } })
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
