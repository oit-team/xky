<script>
export default {
  props: {
    canReload: Boolean,
  },
}
</script>

<template>
  <view class="flex justify-center items-center w-full">
    <view class="w-1_2 text-center text-xs text-[#888] ">
      <van-divider content-position="center">
        {{ canReload ? '正在加载' : '暂无更多' }}
      </van-divider>
    </view>
  </view>
</template>

<style scoped>
.w-1_2 {
  width: 50%;
}
</style>
