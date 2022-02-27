import Vue from 'vue'
import App from './App.vue'
import router from './router.js';
import iView from 'iview';
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import axios from 'axios'


import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueRouter)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
