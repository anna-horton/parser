import VueRouter from 'vue-router'
import Landing from './Landing.vue'
import AdminPage from './admin/Admin.vue'
import Login from './Login.vue'
import Logout from './Logout.vue'
import Reg from './Reg.vue'
import CategoriesAdmin from './admin/Categories'
import DactylAdmin from './admin/Dactyl'
import Dashboard from './user/Dashboard'
import Rules from './user/Rules'
import Dactyl from './user/Dactyl'
import Categories from './user/Categories'

const routes = [
    {
        path: '/', component: Landing
    },
    {
        path: '/admin', component: AdminPage
    },
    {
        path: '/logout', component: Logout
    },
    {
        path: '/login', component: Login
    },
    {
        path: '/reg', component: Reg
    },
    {
        path: '/admin/categories', component: CategoriesAdmin
    },
    {
        path: '/admin/dactyl', component: DactylAdmin
    },
    {
        path: '/dashboard', component: Dashboard
    },
    {
        path: '/categories', component: Categories
    },
    {
        path: '/rules', component: Rules
    },
    {
        path: '/dactyl', component: Dactyl
    }
]


const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (!['/login', '/reg', '/logout', '/'].includes(to.path)) {
        let info = localStorage.getItem('authInfo')
        if (info) info = JSON.parse(info);

        if (info && info.token) {
            let expiredTime = getJWTExpireDate(info.token)
            new Date(expiredTime).getTime() < Date.now() ? next({
                path: '/',
                replace: true
            }) : next()
        } else next({
            path: '/',
            replace: true
        })
    } else next()
})

function getJWTExpireDate(jwtToken) {
    if (jwtToken) {
        try {
            const [, payload] = jwtToken.split('.');
            const { exp: expires } = JSON.parse(window.atob(payload));
            if (typeof expires === 'number') {
                return new Date(expires * 1000);
            }
        } catch {
            // ignore
        }
    }
    return null;
}

export default router