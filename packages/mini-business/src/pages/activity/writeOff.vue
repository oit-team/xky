<script>
import { getLotteryDetailed, getLotteryRecord } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'

export default {
  data() {
    return {
      formData: {
        pageSize: 20,
        pageNum: 1,
        shopId: '',
        userId: '',
        lotteryTicket: 0,
      },
      writeOffList: [],
      showEmpty: false,
      cardList: {},
      showPopup: false,
      active: 0,
      noReload: false,
    }
  },
  watch: {
  },
  onShow() {
    this.getLotteryRecord()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getLotteryRecord()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    convertImageSize,
    async getLotteryRecord() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.formData.shopId = this.$store.state.userInfo.shopId
      const res = await getLotteryRecord({
        ...this.formData,
      }).finally(() => this.$toast.clear())

      this.writeOffList = res.body.result
      this.showEmpty = this.writeOffList.length === 0
      this.noReload = res.body.count < this.formData.pageSize
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getLotteryRecord({
        ...this.formData,
      }).finally(() => this.$toast.clear())

      this.writeOffList = [...this.writeOffList, ...res.body.result]
      this.noReload = res.body.count < this.formData.pageSize
    },
    async getCard(index) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = awaitgetLotteryDetailed({
        recordId: index,
      }).finally(() => this.$toast.clear())

      this.showPopup = true
      this.cardList = res.body.result
    },
    onChange(e) {
      this.active = e.detail.name
      this.formData.lotteryTicket = this.active
      this.getLotteryRecord()
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100 w-full">
    <van-tabs :active="active" class="w-full" @change="onChange">
      <van-tab title="拓客核销" :name="0" />
      <van-tab title="活动核销" :name="1" />
    </van-tabs>
    <!--   核销记录 -->
    <view class="content w-full h-full mt-2">
      <view v-if="showEmpty">
        <van-empty description="暂无数据" />
      </view>
      <view v-else class="flex flex-col pb-2 px-2 box-border w-full">
        <view
          v-for="(item, index) in writeOffList"
          :key="index"
          class="py-2 bg-white rounded-md mt-2 box-border"
        >
          <view class="flex items-center px-3" @click="getCard(item.recordId)">
            <van-image
              width="50"
              height="50"
              :src="item.headPortrait"
              class="mr-2 rounded-md overflow-hidden"
            />
            <view class="text-sm">
              <view>
                {{ item.weChatName || '暂无' }}
              </view>
              <view class="text-xs text-gray-500 my-2">
                {{ item.telephone || '暂无' }}
              </view>
              <view class="text-xs text-gray-500 ">
                {{ item.useTime || '暂无' }}
              </view>
            </view>
          </view>
        </view>

        <view v-if="noReload" class="text-center text-xs text-[#888] my-2">
          没有更多了
        </view>
      </view>
    </view>

    <van-popup
      :show="showPopup"
      position="bottom"
      custom-style="height: 30%;"
      round
      @click-overlay="showPopup = false"
    >
      <view class="w-full py-3 px-2 box-border">
        <view
          class="flex justify-between px-3 py-1 box-border bg-white border-1 border-gray-100 border-solid rounded-lg"
        >
          <view class="flex items-center">
            <van-image
              width="70"
              height="70"
              :src="convertImageSize(cardList.imgUrl, 's')"
              fit="contain"
              class="mr-2 border-right-dotted bg-neutral-100 rounded-md"
            />
            <view class="w-full">
              <view class="width-3-5 truncate">
                {{ cardList.vouchersName }}
              </view>
              <view class="text-xs text-gray-500 my-1">
                有效期：{{ cardList.effectiveStart }}-{{ cardList.effectiveEnd }}
              </view>
              <view class="text-xs text-gray-500 my-1">
                核销时间：{{ cardList.useTime }}
              </view>
              <view class="text-xs text-gray-500 my-1">
                来源：{{ cardList.fromName }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </container>
</template>

<style scoped>
::v-deep .van-image__img {
  border-radius: 8px;
}

::v-deep .van-image {
  display: block;
}
</style>
