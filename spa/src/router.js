import VueRouter from 'vue-router'
import HomePage from './Home.vue'
import AdminPage from './Admin.vue'
import Login from './Login.vue'
import Logout from './Logout.vue'
import Reg from './Reg.vue'



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
]


const router = new VueRouter({
    routes,
})

export default router