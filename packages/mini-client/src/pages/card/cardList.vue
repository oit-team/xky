<script>
import { getLotteryTicketDetailed } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'

export default {
  components: {},
  data() {
    return {
      name: 'Vue',
      cardList: [],
      showEmpty: false,
      id: '',
    }
  },
  computed: {},
  watch: {},
  onLoad(option) {
    this.id = option.id
  },
  onShow() {
    this.getCard()
  },
  methods: {
    convertImageSize,
    async getCard() {
      const res = await this.$loading(
        getLotteryTicketDetailed({
          shopId: this.id,
          weChatId: this.$store.state.userInfo.id,
        }),
      )
      this.showEmpty = res.body.result?.length === 0
      this.cardList = res.body.result
      this.cardList.forEach((item) => {
        item.effectiveStart = item.effectiveStart.replace(/-/g, '/')
        item.effectiveEnd = item.effectiveEnd.replace(/-/g, '/')
      })
      this.$toast.clear()
    },
    toInfo(item) {
      uni.navigateTo({
        url: `/pages/card/qrCode?item=${JSON.stringify(item)}`,
      })
    },
  },
}
</script>

<template>
  <container classes="w-full h-full bg-neutral-100">
    <view v-if="showEmpty">
      <van-empty description="暂无数据" />
    </view>
    <view v-else class="w-full p-3 box-border">
      <view
        v-for="item in cardList"
        :key="item.vouchersId"
        class="flex items-center py-3 card-item rounded-xl relative box-border mb-2 bg-white overflow-hidden"
      >
        <van-image
          width="70"
          height="70"
          fit="contain"
          class="mx-3 rounded-xl"
          :src="convertImageSize(item.resUrl, 's')"
        />
        <view class="flex-1 h-full">
          <view class="flex justify-between items-center pr-3">
            <view class="text-gray-500 font-extrabold">
              {{ item.vouchersName }}
            </view>
            <view v-if="item.state === 2" @click="toInfo(item)">
              <van-button
                size="small"
                plain
                round
                color="#6FA7FF"
                type="info"
              >
                立即使用
              </van-button>
            </view>
          </view>
          <view class="text-xs text-gray-500">
            备注：{{ item.vouchersNote || '暂无' }}
          </view>
          <view class="text-xs text-gray-500">
            使用期限
          </view>
          <view class="text-xs text-gray-500">
            {{ item.effectiveStart }}-{{ item.effectiveEnd }}
          </view>
        </view>
        <view v-if="item.state === 3" class="absolute -top-2 right-2">
          <van-image
            width="50"
            height="50"
            :src="require('../../static/image/used.png')"
          />
        </view>
        <view v-if="item.state === 4" class="absolute -top-2 right-2">
          <van-image
            width="50"
            height="50"
            :src="require('../../static/image/expired.png')"
          />
        </view>
        <view v-if="item.state === 1" class="absolute -top-2 right-2">
          <van-image
            width="50"
            height="50"
            :src="require('../../static/image/wait.svg')"
          />
        </view>
      </view>
    </view>
  </container>
</template>

<style lang="scss" scoped>
::v-deep .van-image__img {
  border-radius: 8px;
}

::v-deep .van-image {
  display: block
}
.card-item{
  border: 1px solid #E3E6E9;
}
</style>
