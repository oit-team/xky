import Vue from 'vue'
import App from './App'
import store from '@/store/index'

import vantMixin from '@/mixins/vant'
import { promiseLoading } from '@/utils/helper'
import { post } from '@/api'

// vant组件
import Toast from '@/wxcomponents/vant/toast/toast'
import Dialog from '@/wxcomponents/vant/dialog/dialog'

// 公共组件，只能在main.js里注册
import Container from '@/components/business/container'

// import 'windi.css'
import 'uno.css'

Vue.component('container', Container)
Vue.mixin(vantMixin)

Vue.prototype.uni = uni
Vue.prototype.$post = post
Vue.prototype.$toast = Toast
Vue.prototype.$dialog = Dialog
Vue.prototype.$loading = promiseLoading

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
