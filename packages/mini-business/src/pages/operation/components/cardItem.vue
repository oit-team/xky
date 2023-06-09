<script>
export default {
  props: {
    item: Object,
  },
}
</script>

<template>
  <view class="flex justify-between p-2 box-border">
    <view class="flex width-3/5 items-center w-full">
      <van-image
        width="70"
        height="70"
        :src="item.impUrl"
        class="mr-2 rounded-md"
      />
      <view class="text-sm flex-1">
        <view class="van-multi-ellipsis--l2 w-full flex justify-between items-center">
          <view>
            {{ item.vouchersName || '暂无' }}
          </view>

          <view class="text-xs">
            <span class="text-[#888]">库存：</span> {{ item.jackpotInventory || '0' }}
          </view>
        </view>
        <view class="text-xs text-gray-500 my-2 w-full flex justify-between items-center">
          <view>
            <slot name="price" />
          </view>

          <view class="flex flex-col items-center justify-around text-sm">
            <slot />
          </view>
        </view>
        <view class="text-xs text-gray-500 ">
          {{ item.periodValidity || '暂无' }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang='scss' scoped>
::v-deep van-image {
  display: flex;
}
</style>
