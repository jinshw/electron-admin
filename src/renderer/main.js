import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

const Store = require('electron-store');
const electronStore = new Store();
var setting = electronStore.get('setting')

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// to avoild accesing electorn api from web app build
if (window && window.process && window.process.type === 'renderer') {
  const { ipcRenderer } = require('electron')

  ipcRenderer.on('href', (event, data) => {
    console.log("main...href....",data)
    // if (data.route) {
    //   router.push(data.route)
    // }
    // window.location.href = data
    router.push(data);

    // ElementUI.MessageBox('这是一段内容', '标题名称', {
    //   confirmButtonText: '确定'
    // });

  })
  ipcRenderer.on('redirect', (event, data) => {
    console.log("main...redirect....",data)
    // router.push(data);
    router.push({ path: data || '/',query: ""})
  })

}

