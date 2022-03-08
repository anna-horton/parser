import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        authInfo: {
            user: null,
            isLogin: false,
            token: ''
        },
        gestures: []
    },
    getters: {
        user: state => {
            return state.authInfo.user
        },
        token: state => state.authInfo.token,
        isLogin: state => state.authInfo.isLogin,
        authInfo: state => state.authInfo
    },
    mutations: {
        setUser: (state, info) => {
            state.authInfo.user = info
        },
        setGestures: (state, array) => {
            state.gestures = array
        },
        setLoginState: (state, status) => state.authInfo.isLogin = status,
        setToken: (state, token) => state.authInfo.token = token,
        revokeToken: state => state.authInfo.token = '',
        loadUserInfo: state => {
            if (localStorage.getItem('authInfo') && localStorage.getItem('authInfo').length > 10) {
                state.authInfo = JSON.parse(localStorage.getItem('authInfo'))
            }
        },
        logout: state => {
            state.authInfo.isLogin = false
            state.authInfo.user = null
        }
    },
    actions: {
        login: async (context, payload) => {
            try {
                const response = await axios.post(`/api/login`, payload)
                if (response.status !== 200) throw {
                    code: response.status,
                    message: response.statusText
                }
                if (response.data.code !== 200) throw response.data
                context.commit('setLoginState', true)
                context.commit('setUser', response.data.object)
                context.commit('setToken', response.data.token)
                localStorage.setItem('authInfo', JSON.stringify(context.getters.authInfo))
                return response.data
            } catch (err) {
                console.log(err)
                return err
            }
        },
        logout: async ({commit}) => {
            commit('revokeToken')
            commit('logout')
            localStorage.removeItem('authInfo')
        },
        getGestures: async (ctx) => {
            try {
                const response = await axios.get(`/api/gestures`, {
                    headers: {
                        'authorization': 'Basic ' + ctx.getters.token
                    }
                })
                if (response.status !== 200) throw {
                    code: response.status,
                    message: response.statusText
                }
                if (response.data.code !== 200) throw response.data
                ctx.commit('setGestures', response.data.array)
            } catch (err) {
                console.log(err)
                return err
            }
        }
    },

})


