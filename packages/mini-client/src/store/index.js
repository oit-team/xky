import Vue from 'vue'
import Vuex from 'vuex'
import { setToken } from '@/utils/token'
import { updateUserInfo, wxLogin } from '@/api/account'
import { unwrapPromise } from '@/utils/helper'
import Toast from '@/wxcomponents/vant/toast/toast'

Vue.use(Vuex)

const plugins = process.env.NODE_ENV !== 'production' ? [Vuex.createLogger()] : []

export default new Vuex.Store({
  plugins,

  state: {
    userInfo: {},
    userPromise: null,
  },

  getters: {
    // 是否已登录
    logged: state => Object.keys(state.userInfo).length > 0,
  },

  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    setWorkingStatus(state, payload) {
      state.userInfo.workingState = payload
    },
    setHeadPortrait(state, payload) {
      state.userInfo.headPortrait = payload
    },
  },

  actions: {
    // 微信登录
    async wxLogin(ctx) {
      // 先调用登录
      const loginPromise = unwrapPromise(uni.login({ provider: 'weixin' }))

      const { encryptedData, iv } = await unwrapPromise(uni.getUserProfile({
        desc: '登录小程序',
        lang: 'zh_CN',
      })).catch((err) => {
        Toast.fail('取消授权')
        throw err
      })
      const { code } = await loginPromise

      const res = await wxLogin({
        encryptedData,
        iv,
        jsCode: code,
      })

      setToken(res.body.token)

      ctx.commit('setUserInfo', res.body.resultList)
    },
    // 更新用户信息
    async updateUserInfo(ctx) {
      ctx.state.userPromise = updateUserInfo()
      const res = await ctx.state.userPromise
      ctx.commit('setUserInfo', res.body)
      setToken(res.body.token)
    },
  },
})
