// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import VueResource from 'vue-resource'
Vue.use(VueResource)

import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/columns'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/close'
import 'vue-awesome/icons/chevron-circle-up'
import 'vue-awesome/icons/chevron-circle-down'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: xGOOGLEKEYx,
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
