<script>
export default {
  data() {
    return {}
  },
  methods: {
    async login() {
      await this.$loading(
        this.$store.dispatch('wxLogin'),
        {
          message: '正在登录...',
          delay: false,
        },
      )

      this.$emit('login')
    },
  },
}
</script>

<template>
  <view class="w-full flex-1 px-2 box-border">
    <view class="w-full flex justify-center py-3">
      <van-empty description="未登录" />
    </view>

    <view class="w-full flex justify-center">
      <van-button type="info" block class="width-1-3" round @click="login">
        点击登录
      </van-button>
    </view>
  </view>
</template>

<style scoped>

</style>
