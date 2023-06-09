<script>
export default {
}
</script>

<template>
  <view class="w-full h-full rounded-xl bg-white">
    <view class="flex justify-between items-center pt-3">
      <view class="px-2 flex items-center text-sm">
        <view class="border-l-2 border-[#6FA7FF] mr-1 h-10px border-solid" />
        <slot name="left-title" />
      </view>
      <view class="p-2 box-border flex items-center text-xs">
        <slot name="right-title" />
      </view>
    </view>
    <van-divider />
    <slot name="content" />
  </view>
</template>

<style scoped>

</style>
