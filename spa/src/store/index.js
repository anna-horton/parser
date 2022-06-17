import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);
import router from "../router";

export default new Vuex.Store({
  state: {
    authInfo: {
      user: null,
      isLogin: false,
      token: "",
    },
    gestures: [],
    dactyls: [],
    categories: [],
  },
  getters: {
    user: (state) => {
      return state.authInfo.user;
    },
    token: (state) => state.authInfo.token,
    isLogin: (state) => state.authInfo.isLogin,
    authInfo: (state) => state.authInfo,
    gestures: (state) => state.gestures,
    categories: (state) => state.categories,
    dactyls: (state) => state.dactyls,
  },
  mutations: {
    setUser: (state, info) => {
      state.authInfo.user = info;
    },
    setGestures: (state, array) => {
      state.gestures = array;
    },
    setCategories: (state, array) => {
      state.categories = array;
    },
    removeCategory: (state, id) => {
      state.categories = [...state.categories.filter((g) => g._id !== id)];
    },
    addCategory: (state, object) => {
      state.categories = [...state.categories, object];
    },
    updateCategory: (state, object) => {
      state.categories = [
        ...state.categories.map((g) => {
          return g._id === object._id ? object : g;
        }),
      ];
    },
    addGestures: (state, object) => {
      state.gestures = [...state.gestures, object];
    },
    updateGestures: (state, object) => {
      state.gestures = [
        ...state.gestures.map((g) => {
          return g._id === object._id ? object : g;
        }),
      ];
    },
    removeGestures: (state, id) => {
      state.gestures = [...state.gestures.filter((g) => g._id !== id)];
    },
    setLoginState: (state, status) => (state.authInfo.isLogin = status),
    setToken: (state, token) => (state.authInfo.token = token),
    revokeToken: (state) => (state.authInfo.token = ""),
    loadUserInfo: (state) => {
      if (
        localStorage.getItem("authInfo") &&
        localStorage.getItem("authInfo").length > 10
      ) {
        state.authInfo = JSON.parse(localStorage.getItem("authInfo"));
      }
    },
    logout: (state) => {
      state.authInfo.isLogin = false;
      state.authInfo.user = null;
    },

    setDactyls: (state, array) => {
      state.dactyls = array;
    },
    removeDactyl: (state, id) => {
      state.dactyls = [...state.dactyls.filter((g) => g._id !== id)];
    },
    addDactyl: (state, object) => {
      state.dactyls = [...state.dactyls, object];
    },
    updateDactyl: (state, object) => {
      state.dactyls = [
        ...state.dactyls.map((g) => {
          return g._id === object._id ? object : g;
        }),
      ];
    },
  },
  actions: {
    login: async (context, payload) => {
      try {
        const response = await axios.post(`/api/login`, payload);
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 200) throw response.data;
        context.commit("setLoginState", true);
        context.commit("setUser", response.data.object);
        context.commit("setToken", response.data.token);
        localStorage.setItem(
          "authInfo",
          JSON.stringify(context.getters.authInfo)
        );
        return response.data;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    signup: async (ctx, payload) => {
      try {
        const response = await axios.post(`/api/users`, payload);
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 200) throw response.data;

        ctx.commit("setLoginState", true);
        ctx.commit("setUser", response.data.object);
        ctx.commit("setToken", response.data.token);
        localStorage.setItem("authInfo", JSON.stringify(ctx.getters.authInfo));

        return response.data;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    logout: async ({ commit }) => {
      commit("revokeToken");
      commit("logout");
      localStorage.removeItem("authInfo");
    },
    removeGusture: async (ctx, id) => {
      try {
        const response = await axios.delete(`/api/gestures/${id}`, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        ctx.commit("removeGestures", id);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    createGestures: async (ctx, payload) => {
      try {
        const response = await axios.post(`/api/gestures`, payload, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("addGestures", response.data.object);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    updateGestures: async (ctx, payload) => {
      try {
        const response = await axios.put(
          `/api/gestures/${payload._id}`,
          payload,
          {
            headers: {
              authorization: "Basic " + ctx.getters.token,
            },
          }
        );
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("updateGestures", response.data.object);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    getGestures: async (ctx, payload) => {
      try {
        let qs = "";

        if (payload) {
          if (payload.name) qs += "name=" + payload.name;
          if (payload.category) qs += "category=" + payload.category;
        }

        const response = await axios.get(`/api/gestures?` + qs, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("setGestures", response.data.array);

        return response.data.array;
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    removeCategory: async (ctx, id) => {
      try {
        const response = await axios.delete(`/api/categories/${id}`, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        ctx.commit("removeCategory", id);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    createCategory: async (ctx, payload) => {
      try {
        const response = await axios.post(`/api/categories`, payload, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("addCategory", response.data.object);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    updateCategory: async (ctx, payload) => {
      try {
        const response = await axios.put(
          `/api/categories/${payload._id}`,
          payload,
          {
            headers: {
              authorization: "Basic " + ctx.getters.token,
            },
          }
        );
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("updateCategory", response.data.object);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    getCategories: async (ctx) => {
      try {
        const response = await axios.get(`/api/categories`, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("setCategories", response.data.array);
      } catch (err) {
        if (err.code === 403) router.push("/logout");
        console.log(err);
        return err;
      }
    },

    removeDactyl: async (ctx, id) => {
      try {
        const response = await axios.delete(`/api/dactyl/${id}`, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        ctx.commit("removeDactyl", id);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    createDactyl: async (ctx, payload) => {
      try {
        const response = await axios.post(`/api/dactyl`, payload, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("addDactyl", response.data.object);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    updateDactyl: async (ctx, payload) => {
      try {
        const response = await axios.put(
          `/api/dactyl/${payload._id}`,
          payload,
          {
            headers: {
              authorization: "Basic " + ctx.getters.token,
            },
          }
        );
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("updateDactyl", response.data.object);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    getDactyls: async (ctx) => {
      try {
        const response = await axios.get(`/api/dactyl`, {
          headers: {
            authorization: "Basic " + ctx.getters.token,
          },
        });
        if (response.status !== 200)
          throw {
            code: response.status,
            message: response.statusText,
          };
        if (response.data.code !== 0) throw response.data;
        ctx.commit("setDactyls", response.data.array);
      } catch (err) {
        if (err.code === 403) router.push("/logout");
        console.log(err);
        return err;
      }
    },
  },
});
