import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/containers/Home';
import StoryMap from '@/containers/StoryMap';
import Login from '@/containers/Login';
import MapList from '@/containers/MapList';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'MapList',
      component: MapList,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/map/:id',
      name: 'StoryMap',
      component: StoryMap,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/home',
      name: 'Home',
      component: Home
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('isLogin');

  if (to.meta.requireAuth) {

    if (isLogin) {
      next();
    } else {
      next({
        path: '/login'
      });
    }
  } else if (to.fullPath === '/login' && isLogin) {
    next({
      path: '/'
    });
  } else {
    next();
  }
});

export default router;
