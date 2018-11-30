import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import Schedule from './views/Schedule.vue';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: 'Awesome Timetable',
            },
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
            component: Dashboard,
            meta: {
                title: 'Dashboard',
            },
        },
        {
            path: '/schedule/:scheduleName',
            name: 'schedule',
            component: Schedule,
            meta: {
                title: 'My Plan',
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router;
