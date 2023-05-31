<script>
import { getDrawProduct } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'

export default {
  data() {
    return {
      formData: {
        pageSize: 20,
        pageNum: 1,
        shopId: '',
      },
      showEmpty: true,
      luckList: [],
    }
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getDrawProduct()
    this.$toast.clear()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
  },
  onShow() {
    this.getDrawProduct()
  },
  methods: {
    convertImageSize,
    async getDrawProduct() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.formData.shopId = this.$store.state.userInfo.shopId
      const res = await getDrawProduct({
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.luckList = [...res.body.result]
      this.showEmpty = this.luckList.length <= 0
      this.$toast('成功')
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.formData.shopId = this.$store.state.userInfo.shopId
      const res = await getDrawProduct({
        ...this.formData,
      })
      this.$toast.clear()
      this.luckList = [...this.luckList, ...res.body.allStateCount]
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <!--    奖池列表 -->
    <view class="content flex-1 w-full">
      <view v-if="showEmpty" class="w-full h-full">
        <van-empty description="暂无数据" />
      </view>
      <view v-else class="grid grid-cols-4 gap-2 px-2 py-3 h-full">
        <view
          v-for="(item, index) in luckList"
          :key="index"
          class="flex flex-col items-center bg-white rounded-md py-1 box-border overflow-hidden"
        >
          <van-image
            width="60"
            height="60"
            :src="convertImageSize(item.imgRes[0], 's')"
            fit="contain"
          />
          <view class="text-center w-full">
            <view class="text-xs my-1 truncate w-full">
              {{ item.vouchersName }}
            </view>
            <view class="text-xs text-red-500 ">
              ￥{{ item.jackpotPrice }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </container>
</template>

<style scoped>
::v-deep .van-image__img {
  border-radius: 8px;
}

::v-deep .van-image {
  display: block
}
</style>
