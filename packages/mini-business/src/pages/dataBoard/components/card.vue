<script>
export default {
}
</script>

<template>
  <view class="w-full h-full rounded bg-white p-2 box-border">
    <view class="flex justify-between items-center">
      <view class="flex items-center text-sm">
        <view class="border-l-2 border-[#6FA7FF] mr-1 h-10px border-solid" />
        <slot name="left-title" />
      </view>
      <view class="box-border flex items-center text-xs">
        <slot name="right-title" />
      </view>
    </view>
    <slot name="content" />
  </view>
</template>

<style scoped>

</style>
