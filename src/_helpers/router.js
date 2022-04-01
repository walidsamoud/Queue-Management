import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const router = new Router({
    mode: 'history',
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: () => import('../views/Index.vue'),
        },
        {
            path: '/:short_code',
            component: () => import('../views/Index.vue'),
        },
        {
            path: '/t/:uid',
            component: () => import('../views/track/Ticket.vue'),
        }
    ]
})

import NProgress from 'nprogress';

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const userLoggedIn = JSON.parse(localStorage.getItem('user'));

    if (to.meta.authRequired && !(userLoggedIn)) {
        if(!userLoggedIn) { localStorage.setItem('user', null) }
        return next('/login');
    }


    next();
})

router.beforeResolve(async(to, from, next) => {
    //const userLoggedIn = JSON.parse(localStorage.getItem('user'));
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start()
    }
    next()
})

router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done()
})
export default router