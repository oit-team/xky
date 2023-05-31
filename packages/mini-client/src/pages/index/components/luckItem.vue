<script>
import { convertImageSize } from '@/utils/helper'

export default {
  props: {
    list: Array,
  },
  methods: {
    convertImageSize,
  },
}
</script>

<template>
  <view class="w-full h-full">
    <view
      v-for="item in list"
      :key="item.shopId"
      class="flex justify-between pr-3 py-3 bg-white rounded-xl mb-2 luck-item"
      @click="$emit('show', item)"
    >
      <view class="flex width-3-5 items-center">
        <van-image
          width="70"
          height="70"
          :src="convertImageSize(item.headPortrait, 's')"
          class="mx-3 rounded-md bg-gray-100 overflow-hidden"
        />
        <view class="">
          <view class="font-extrabold">
            {{ item.shopName }}
          </view>
          <view class="text-xs text-gray-500 my-2">
            地址：{{ item.address }}
          </view>
          <view class="text-xs text-gray-500 ">
            券数：<text class="text-orange-500">
              {{ item.lotteryTicketNum }}
            </text>
          </view>
        </view>
      </view>
      <view class="flex items-start text-sm">
        <van-icon name="ellipsis" color="#6FA7FF" size="16" />
      </view>
    </view>
  </view>
</template>

<style scoped>
::v-deep .van-image {
  display: block
}
.luck-item{
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.05);
}
</style>
