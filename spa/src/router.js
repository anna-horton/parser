import VueRouter from 'vue-router'
import HomePage from './Home.vue'
import AdminPage from './admin/Admin.vue'
import Login from './Login.vue'
import Logout from './Logout.vue'
import Reg from './Reg.vue'
import CategoriesAdmin from './admin/Categories'
import DactylAdmin from './admin/Dactyl'
import Dashboard from './user/Dashboard'

const routes = [
    {
        path: '/', component: HomePage
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
    }
]


const router = new VueRouter({
    routes,
})

router.beforeEach((to, from, next) => {
    console.log(router.app.$store.getters.authInfo)

    if (['/login', '/reg', '/logout'].indexOf(to.path) !== -1) {
        next()
    } else {
        if (router.app.$store.getters.isLogin) {
            let token = getJWTExpireDate(router.app.$store.getters.token)
            console.log(token)
            next()
        } else next('/login')
        console.log(router.app.$store.getters.isLogin)
        console.log(router.app.$store.getters.token)
    }
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