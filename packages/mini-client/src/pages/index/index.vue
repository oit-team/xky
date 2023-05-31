<script>
import LuckItem from './components/luckItem'
import { getLotteryTicketShop } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'
import notLogged from '@/components/business/notLogged/notLogged'

export default {
  components: {
    LuckItem,
    NotLogged: notLogged,
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
    // this.$toast.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    // })
  },
  async onShow() {
    await this.$store.state.userPromise
    if (this.logged)
      await this.getLotteryTicketShop()
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
        url: `/pages/index/cardList?id=${item.shopId}`,
      })
      this.showItem = item
      // console.log('show')
      // this.getCard(item.shopId)
      // this.showPopup = true
      // this.cardList = []
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100 text-[#888]">
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged @login="getLotteryTicketShop()" />
    </view>
    <view v-if="logged" class="content w-full">
      <view v-if="showEmpty">
        <van-empty description="暂无数据" />
      </view>
      <view v-else class="flex flex-col py-3 px-2">
        <luck-item :list="winList" @show="show()" />
      </view>
    </view>

    <!--    <van-popup -->
    <!--      :show="showPopup" -->
    <!--      position="bottom" -->
    <!--      custom-style="height: 70%;" -->
    <!--      round -->
    <!--      @click-overlay="showPopup = false" -->
    <!--    > -->
    <!--    </van-popup> -->
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
/*.card-item_left{*/
/*    border: 1px solid #ccc;*/
/*    position: absolute;*/
/*    left: 0px;*/
/*    top: 50%;*/
/*    transform: translate(-50%, -50%);*/
/*    background-color: #fff;*/
/*    z-index: 9999;*/
/*}*/
/*.card-item_right{*/
/*    border: 1px solid #ccc;*/
/*    position: absolute;*/
/*    right: 0px;*/
/*    top: 50%;*/
/*    transform: translate(50%, -50%);*/
/*    background-color: #fff;*/
/*    z-index: 9999;*/
/*}*/
</style>
