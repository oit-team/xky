<script>
export default {
  props: {
    item: Object,
  },
}
</script>

<template>
  <view class="flex justify-between p-2 box-border">
    <view class="flex width-3/5 items-center">
      <van-image
        width="70"
        height="70"
        :src="item.impUrl"
        class="mr-2 rounded-md"
      />
      <view class="text-sm">
        <view class="van-multi-ellipsis--l2 w-full">
          {{ item.vouchersName }}
        </view>
        <view class="text-xs text-gray-500 my-2">
          ￥{{ item.jackpotPrice || '0' }}
        </view>
        <view class="text-xs text-gray-500 ">
          有效期：{{ item.periodValidity }}
        </view>
      </view>
    </view>
    <view class="flex flex-col items-center justify-around text-sm">
      <view>× {{ item.jackpotInventory }}</view>
      <slot />
    </view>
  </view>
</template>

<style lang='scss' scoped>
::v-deep van-image {
  display: flex;
}
</style>
