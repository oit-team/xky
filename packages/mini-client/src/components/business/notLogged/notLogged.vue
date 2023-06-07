<script>
export default {
  emits: ['login'],
  data() {
    return {}
  },
  methods: {
    async login() {
      this.$toast.loading()
      await this.$store.dispatch('wxLogin').finally(() => this.$toast.clear())

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
