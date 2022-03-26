import Vue from 'vue';
import VueRouter from 'vue-router';
import api from '../services/api';

//COMPONENTS
import LoginView from '../views/LoginView'
import DashboardView from '../views/DashboardView'
import ScheduleView from '../views/ScheduleView'
import UsersView from '../views/UsersView'
import ClassBlockView from '../views/ClassBlockView'
import ExercisesView from '../views/ExercisesView'
import PackagesView from '../views/PackagesView'
import NotificationsView from '../views/NotificationsView'
import ReportsView from '../views/ReportsView'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: LoginView,
    },
    {
        path: '/dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/schedule',
        component: ScheduleView,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        component: UsersView,
        meta: { requiresAuth: true }
    },
    {
        path: '/class-block',
        component: ClassBlockView,
        meta: { requiresAuth: true }
    },
    {
        path: '/exercises',
        component: ExercisesView,
        meta: { requiresAuth: true }
    },
    {
        path: '/packages',
        component: PackagesView,
        meta: { requiresAuth: true }
    },
    {
        path: '/notifications',
        component: NotificationsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/reports',
        component: ReportsView,
        meta: { requiresAuth: true }
    }
];

const router = new VueRouter({
    mode: 'history',
    routes: routes
});

/***
 * Método para checar autenticação
 */
router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!api.isLogged({'token': localStorage.getItem('access_token')})) {
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router;