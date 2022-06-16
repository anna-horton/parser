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
        authInfo: state => state.authInfo,
        gestures: state => state.gestures
    },
    mutations: {
        setUser: (state, info) => {
            state.authInfo.user = info
        },
        setGestures: (state, array) => {
            console.log('array')
            console.log(array)
            state.gestures = array
        },
        addGestures: (state, object) => {
            state.gestures = [...state.gestures, object]
        },
        updateGestures: (state, object) => {
            state.gestures = [...state.gestures.map(g => {
                return g._id === object._id ? object : g
            })]
        },
        
        removeGestures: (state, id) => {
            state.gestures = [...state.gestures.filter(g => g._id !== id)]
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
        signup: async (ctx, payload) => {
            try {
                const response = await axios.post(`/api/users`, payload)
                if (response.status !== 200) throw {
                    code: response.status,
                    message: response.statusText
                }
                if (response.data.code !== 200) throw response.data

                ctx.commit('setLoginState', true)
                ctx.commit('setUser', response.data.object)
                ctx.commit('setToken', response.data.token)
                localStorage.setItem('authInfo', JSON.stringify(ctx.getters.authInfo))

                return response.data
            } catch(err) {
                console.log(err)
                return err
            }
        },
        logout: async ({commit}) => {
            commit('revokeToken')
            commit('logout')
            localStorage.removeItem('authInfo')
        },
        removeGusture: async (ctx, id) => {
            try {
                const response = await axios.delete(`/api/gestures/${id}`, {
                    headers: {
                        'authorization': 'Basic ' + ctx.getters.token
                    }, 
                })
                if (response.status !== 200) throw {
                    code: response.status,
                    message: response.statusText
                }
                ctx.commit('removeGestures', id)
            } catch (err) {
                console.log(err)
                return err
            }
        },
        createGestures: async (ctx, payload) => {
            try {
                const response = await axios.post(`/api/gestures`, payload,{
                    headers: {
                        'authorization': 'Basic ' + ctx.getters.token
                    }, 
                })
                if (response.status !== 200) throw {
                    code: response.status,
                    message: response.statusText
                }
                if (response.data.code !== 0) throw response.data
                ctx.commit('addGestures', response.data.object)
            } catch (err) {
                console.log(err)
                return err
            }
        },
        updateGestures: async (ctx, payload) => {
            try {
                const response = await axios.put(`/api/gestures/${payload._id}`, payload,{
                    headers: {
                        'authorization': 'Basic ' + ctx.getters.token
                    }, 
                })
                if (response.status !== 200) throw {
                    code: response.status,
                    message: response.statusText
                }
                if (response.data.code !== 0) throw response.data
                ctx.commit('updateGestures', response.data.object)
            } catch (err) {
                console.log(err)
                return err
            }
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
                if (response.data.code !== 0) throw response.data
                ctx.commit('setGestures', response.data.array)
            } catch (err) {
                console.log(err)
                return err
            }
        }
    },

})


