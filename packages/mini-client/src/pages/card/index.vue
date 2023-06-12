<script>
import LuckItem from './components/luckItem'
import { getLotteryTicketShop } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'
import { getFuzzyLocation } from '@/utils/actions'
import { hasToken } from '@/utils/token'
import NotLogged from '@/components/business/notLogged/notLogged'
import ShopItem from '@/components/business/ShopItem/ShopItem'
import { getNearbyMerchants } from '@/api/nearby'

export default {
  components: {
    LuckItem,
    NotLogged,
    ShopItem,
  },
  data() {
    return {
      winList: [],
      cardList: [],
      showEmpty: true,
      showPopup: false,
      formData: {
        pageSize: 15,
        pageNum: 1,
        weChatId: '',
      },
      showItem: {},
      shopList: [],
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  onLoad() {
  },
  async onShow() {
    if (!hasToken())
      return
    await this.$store.state.userPromise
    this.getLotteryTicketShop()
    this.getNearbyMerchants()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getLotteryTicketShop()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    convertImageSize,
    getFuzzyLocation,
    async getLotteryTicketShop() {
      this.formData.weChatId = this.$store.state.userInfo.id
      const { longitude, latitude } = await this.getFuzzyLocation()
      const res = await getLotteryTicketShop({
        lng: longitude,
        lat: latitude,
        ...this.formData,
      })

      this.winList = res.body.result
      this.showEmpty = this.winList.length === 0
      this.$toast.clear()
      uni.stopPullDownRefresh()
    },
    async reload() {
      const { longitude, latitude } = await this.getFuzzyLocation()
      const res = await this.$loading(
        getLotteryTicketShop({
          lng: longitude,
          lat: latitude,
          ...this.formData,
        }),
      )
      this.winList = [...this.winList, ...res.body.allStateCount]
      if (res.body.allStateCount.length === 0)
        this.$toast('加载完毕')
      else
        this.$toast('加载成功')

      this.$toast.clear()
    },
    async getNearbyMerchants() {
      const { longitude, latitude } = await this.getFuzzyLocation()
      const res = await getNearbyMerchants({
        lng: longitude,
        lat: latitude,
        pageNum: 1,
        pageSize: 3,
        userId: this.$store.state.userInfo.id,
      })

      this.shopList = res.body.nearbyMerchants
    },
    show(item) {
      uni.navigateTo({
        url: `/pages/card/cardList?id=${item.shopId}`,
      })
      this.showItem = item
    },
  },
}
</script>

<template>
  <container classes="flex flex-col h-full bg-neutral-100">
    <view v-if="!logged" class="flex-1 w-full">
      <not-logged class="w-full h-full" />
    </view>
    <view v-else class="w-full h-full">
      <view v-if="!showEmpty" class="flex flex-col items-center pb-3">
        <van-empty>
          <template #description>
            <span>您还未参与抽奖</span>
          </template>
        </van-empty>
        <van-divider content-position="center">
          附近商家
        </van-divider>
        <div class="w-full flex flex-col gap-2 p-2">
          <shop-item v-for="item of shopList" :key="item.shopId" :item="item" @click="uni.navigateTo({ url: `/pages/nearby/details?id=${item.shopId}` })" />
        </div>
        <van-button @click="uni.switchTab({ url: '/pages/nearby/nearby' })">
          查看更多
        </van-button>
      </view>
      <view v-else class="flex flex-col p-2 box-border w-full">
        <luck-item :list="winList" @show="show()" />
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
.card-item{
    border: 1px solid #E3E6E9;
}
</style>
