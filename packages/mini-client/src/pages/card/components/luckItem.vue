<script>
import { convertImageSize } from '@/utils/helper'

export default {
  props: {
    list: Array,
  },
  emits: ['show'],
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
      class="flex justify-between pr-3 py-3 bg-white rounded-xl mb-2 luck-item relative"
      @click="$emit('show', item)"
    >
      <view class="flex flex-1 items-center">
        <van-image
          width="70"
          height="70"
          :src="item.headPortrait"
          class="mx-3 rounded-md bg-neutral-100 overflow-hidden"
        />
        <!-- :src="convertImageSize(item.headPortrait, 's')" -->
        <view class="flex flex-col gap-2 flex-1">
          <view class="font-extrabold">
            {{ item.shopName }}
          </view>
          <view class="text-xs text-gray-500">
            地址：{{ item.address }}
          </view>
          <view class="text-xs text-gray-500 flex justify-between">
            <span>
              券数：<text class="text-orange-500">
                {{ item.lotteryTicketNum }}
              </text>
            </span>
            <span>
              距您 {{ item.distance }}km
            </span>
          </view>
        </view>
      </view>
      <view class="flex items-start text-sm absolute right-2">
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
