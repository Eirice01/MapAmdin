import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

// video-player
import VideoPlayer from 'vue-video-player'
// import 'babel-polyfill'

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters
import comConpentes from './components/index'
// include font-awesome
import 'font-awesome/css/font-awesome.min.css'

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})
Vue.use(comConpentes)
Vue.use(BaiduMap, {
  ak: 'lTdEvl2zQHkfE19y0R84P0IRAgSnIuFB&services=&t=20180917142401'
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VideoPlayer)

Vue.config.productionTip = true

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
