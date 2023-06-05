<script>
import { userLogin } from '../../api/account'
import crypto from '../../utils/crypto'

export default {
  name: 'index',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  onLoad() {
  },
  onShow() {
    // uni.hideHomeButton()
    this.useVantModel(['username', 'password'])
  },
  methods: {
    async login() {
      if (this.username === '')
        return this.$toast('请输入账号')
      if (this.password === '')
        return this.$toast('请输入密码')

      const encrypted = crypto.encrypt(this.password)
      this.$toast.loading({
        message: '正在登录...',
        forbidClick: true,
        duration: 0,
      })
      const res = await userLogin({
        userName: this.username,
        passWord: encrypted,
      })
      this.$toast.clear()
      uni.setStorageSync('token', res.body.accessToken)
      this.$store.commit('setUserInfo', res.body.resultList)
      if (uni.getStorageSync('op-confirm')) {
        uni.switchTab({
          url: `/pages/activity/confirm?q=${uni.getStorageSync('op-confirm')}`,
        })
      }
      else {
        uni.switchTab({
          url: '/pages/index/index',
        })
      }
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center">
    <view class="width-3-5 h-full mt-24">
      <view class="w-full flex flex-col justify-center items-center mb-10">
        <van-image
          width="70"
          height="70"
          :src="require('../../static/logo.png')"
        />
        <view class="leading-normal mt-2 text-sm text-center">
          欢迎来到享客易
        </view>
      </view>
      <van-field
        v-model="username"
        placeholder="账号"
        left-icon="contact"
        clearable
        maxlength="50"
        :rules="[{ required: true, message: '请填写账号' }]"
        @change="username = $event.detail"
      />
      <van-field
        v-model="password"
        left-icon="lock"
        type="password"
        clearable
        maxlength="50"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
        @change="password = $event.detail"
      />
      <view class="m-5" @click="login()">
        <van-button round block type="info" native-type="submit">
          登录
        </van-button>
      </view>
    </view>
  </container>
</template>

<style scoped>
::v-deep .van-image {
  display: block;
}
</style>
