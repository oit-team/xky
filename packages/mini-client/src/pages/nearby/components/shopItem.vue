<script>
export default {
  props: {
    item: {
      type: Object,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<template>
  <view class="flex items-center">
    <van-image
      width="70"
      height="70"
      fit="contain"
      class="mr-2"
      :src="item.shopLogo"
    />
    <view class="h-full w-full overflow-hidden">
      <view class="font-bold truncate w-full">
        {{ item.shopName || '暂无' }}
        <span>({{ item.brandName || '暂无' }})</span>
      </view>
      <view class="text-xs leading-loose">
        <view class="truncate w-2/3">
          {{ item.address || '暂无' }}
        </view>
        <view class="flex justify-between">
          <view><span class="text-[#666]">联系电话：</span>{{ item.telephone || '暂无' }}</view>
          <view v-if="show" class="text-[#666]">
            {{ `离您: < ${item.distance || 0} km` }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang='scss' scoped>

</style>
