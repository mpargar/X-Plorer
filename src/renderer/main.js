import Vue from 'vue' // Importar VUE
import axios from 'axios'

import App from './App' // Importamosla app

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app') // Se busca el ID donde implantarlo
