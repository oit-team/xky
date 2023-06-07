<script>
import LuckItem from './components/luckItem'
import { getLotteryTicketShop } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'
import { hasToken } from '@/utils/token'
import NotLogged from '@/components/business/notLogged/notLogged'

export default {
  components: {
    LuckItem,
    NotLogged,
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
    async getLotteryTicketShop() {
      this.formData.weChatId = this.$store.state.userInfo.id
      const res = await getLotteryTicketShop({
        ...this.formData,
      })

      this.winList = res.body.result
      this.showEmpty = this.winList.length === 0
      this.$toast.clear()
      uni.stopPullDownRefresh()
    },
    async reload() {
      const res = await this.$loading(
        getLotteryTicketShop({
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
      <not-logged class="w-full h-full" @login="getLotteryTicketShop()" />
    </view>
    <view v-else class="w-full h-full">
      <view v-if="showEmpty">
        <van-empty description="暂无数据" />
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
