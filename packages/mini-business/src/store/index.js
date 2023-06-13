import Vue from 'vue'
import Vuex from 'vuex'
import { getTokenUser, userLogin } from '../api/account'
import { clearToken, setToken } from '../utils/token'
import { unwrapPromise } from '@/utils/helper'
import { getUserOpenId } from '@/api/luck'
import Toast from '@/wxcomponents/vant/toast/toast'

Vue.use(Vuex)

const plugins = process.env.NODE_ENV !== 'production' ? [Vuex.createLogger()] : []

export default new Vuex.Store({
  plugins,

  state: {
    userInfo: {},
    userPromise: null,
    openId: null,
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
  },

  actions: {
    // 账号登录
    async login(ctx, form) {
      try {
        const res = await userLogin(form)
        setToken(res.body.token)
        ctx.commit('setUserInfo', res.body.resultList)
      }
      catch (err) {
        clearToken()
        throw err
      }
    },
    async getOpenId(ctx) {
      // 用户授权后拿用户信息  获取用户唯一Id
      const loginPromise = unwrapPromise(uni.login({ provider: 'weixin' }))
      const { encryptedData, iv } = await unwrapPromise(uni.getUserProfile({
        desc: '登录小程序',
        lang: 'zh_CN',
      })).catch((err) => {
        Toast.fail('取消授权')
        throw err
      })
      const { code } = await loginPromise

      const res = await getUserOpenId({
        encryptedData,
        iv,
        jsCode: code,
      })
      ctx.state.openId = res.body.resultList.openId
    },
    // 更新用户信息
    async updateUserInfo(ctx) {
      ctx.state.userPromise = getTokenUser()
      try {
        const res = await ctx.state.userPromise
        setToken(res.body.token)
        ctx.commit('setUserInfo', res.body)
      }
      catch (err) {
        uni.reLaunch({
          url: '/pages/login/login',
        })
      }
    },
  },
})
