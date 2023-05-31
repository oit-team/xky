<script>
export default {
  data() {
    return {}
  },
  methods: {},
}
</script>

<template>
  <view class="w-full">
    <view class="w-full flex justify-center py-3">
      <van-empty description="未登录" />
    </view>

    <view class="w-full flex justify-center">
      <van-button type="info" block class="width-1-3" round @click="uni.reLaunch({ url: '/pages/login/login' })">
        点击登录
      </van-button>
    </view>
  </view>
</template>

<style scoped>

</style>
