import Vue from 'vue'
import Vuex from 'vuex'
import { getTokenUser, userLogin } from '../api/account'
import { clearToken, setToken } from '../utils/token'

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
    // 更新用户信息
    async updateUserInfo(ctx) {
      ctx.state.userPromise = getTokenUser()
      const res = await ctx.state.userPromise
      setToken(res.body.token)
      ctx.commit('setUserInfo', res.body)
    },
  },
})
