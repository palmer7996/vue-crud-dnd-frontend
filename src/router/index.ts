import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/character',
    name: 'Character',
    component: () => import('../views/CharacterView.vue'),
  },
  {
    path: '/class',
    name: 'Class',
    component: () => import('../views/ClassView.vue'),
    meta: { requiresAdminAccessLevel: true }, // require authentication to access the class or race routes
  },
  {
    path: '/race',
    name: 'Race',
    component: () => import('../views/RaceView.vue'),
    meta: { requiresAdminAccessLevel: true }, // require authentication to access the class or race routes
  },

];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Check if the route requires authentication
  if (to.meta?.requiresAdminAccessLevel) {
    // Check if the user is not authenticated or does not have admin access level
    if (!userData || userData.accessLevel !== 'admin') {
      // Redirect to login
      next({ name: 'login' });
      console.log(userData);
      alert('You cannot access classes or races if you are not an admin, please login if you are an admin');
      return; // Add return to exit the guard function
    }
  }

  // Continue with the navigation
  next();
});

export default router;
