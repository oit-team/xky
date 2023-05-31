<script>
export default {
  props: {
    list: Array,
  },
  methods: {
  },
}
</script>

<template>
  <view class="w-full h-full">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="py-2 bg-white rounded-md mt-2 box-border"
    >
      <view class="flex justify-between px-3" @click="$emit('show', item.weChatId)">
        <view class="flex width-3-5 items-center">
          <van-image
            width="50"
            height="50"
            :src="item.headPortrait"
            class="mr-2 rounded-md"
          />
          <view class="text-sm">
            <view>
              {{ item.weChatName }}
            </view>
            <view class="text-xs text-gray-500 my-2">
              {{ item.telephone || '暂无' }}
            </view>
            <!--            <view class="text-xs text-gray-500 "> -->
            <!--              {{ item.createTime || item.useTime }} -->
            <!--            </view> -->
          </view>
        </view>
        <view class="flex items-center text-sm">
          × {{ item.oneStateCount || item.lotteryNum }}张
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
::v-deep .van-image__img {
  border-radius: 8px;
}

::v-deep .van-image {
  display: block
}
</style>
