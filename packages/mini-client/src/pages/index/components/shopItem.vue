<script>
export default {
  props: {
    item: Object,
  },
}
</script>

<template>
  <view class="shadow flex flex-col items-center">
    <image
      v-if="item.productUrl"
      :src="item.productUrl"
      class="w-full h-150px rounded-t"
    />
    <image
      v-else
      src="@/static/empty.png"
      class="w-full h-150px rounded-t"
    />
    <!-- 详情 -->
    <view class="p-2 box-border flex flex-col items-center  w-full text-sm">
      <view class="text-[#f13e10] text-sm">
        <span class="text-xs">￥</span>{{ item.productPrice || 0 }}
      </view>
      <view class="van-multi-ellipsis--l2 h-8 text-center leading-4">
        {{ item.productName || '暂无' }}
      </view>
      <!-- <view class="bg-zinc-300 rounded-full mt-2 p-1 w-full box-border flex justify-between items-center text-[#222]">
        <view class="flex items-center">
          <image
            :src="item.shopUrl"
            class="mr-2 w-5 h-5 rounded-full"
          />
          {{ item.shopName }}
        </view>
        <view>
          <van-icon name="arrow" />
        </view>
      </view> -->
    </view>
  </view>
</template>

<style lang='scss' scoped>

</style>
