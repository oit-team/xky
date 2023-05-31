<script>
import { getLotteryTicketShop } from '@/api/luck'
import { getNearbyMerchants } from '@/api/nearby'
import { convertImageSize } from '@/utils/helper'
import notLogged from '@/components/business/notLogged/notLogged'

export default {
  components: {
    NotLogged: notLogged,
  },
  data() {
    return {
      enterpriseList: [],
      // enterpriseList: [{
      //   headPortrait: 'https://picsum.photos/400/400',
      //   address: '上海市浦东新区环林东路金禾新苑上海市浦东新区环林东路金禾新苑',
      //   shopName: '测试',
      //   distance: 2,
      //   num: 5,
      // }],
      showEmpty: false,
      y: 0,
      x: 0,
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  async onShow() {
    await this.$store.state.userPromise
    if (this.logged)
      await this.getLocation()
  },
  // async onPullDownRefresh() {
  //   this.formData.pageNum = 1
  //   // await this.getLotteryTicketShop()
  //   uni.stopPullDownRefresh()
  // },
  // async onReachBottom() {
  //   this.formData.pageNum++
  //   await this.reload()
  // },
  methods: {
    getLotteryTicketShop,
    convertImageSize,

    async getData() {
      const res = await getNearbyMerchants({
        userId: this.$store.state.userInfo.id,
        lng: this.y,
        lat: this.x,
      })
      this.enterpriseList = res.body.nearbyMerchants
      this.showEmpty = res.body.nearbyMerchants?.length === 0
    },
    show(item) {
      this.getCard(item.shopId)
      this.showItem = item
      this.showPopup = true
      this.cardList = []
      this.isLoading = true
    },
    getLocation() {
      const that = this
      // uni.authorize({
      //   scope: 'scope.userFuzzyLocation',
      //   success(res) {
      //     if (res.errMsg === 'authorize:ok') {
      //     }
      //   },
      //   fail(err) {
      //     this.$toast.fail(err)
      //   },
      // })

      wx.getFuzzyLocation({
        type: 'wgs84',
        success(res) {
          that.y = res.longitude.toFixed(2)
          that.x = res.latitude.toFixed(2)
          that.getData()
        },
        fail(err) {
          that.$toast.fail(err)
        },
      })
    },
    toDetails(item) {
      // uni.navigateTo({
      //   url: `/pages/nearby/details?id=${item.id}`,
      // })
    },
  },
}
</script>

<template>
  <container classes="flex flex-col text-[#888] items-center bg-neutral-100 text-sm">
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged @login="getLotteryTicketShop()" />
    </view>
    <view v-else class="content w-full flex-1 flex">
      <view v-if="showEmpty" class="w-full">
        <van-empty description="暂无数据" />
      </view>
      <view v-else class="flex flex-1 flex-col rounded my-3 mx-2 box-border bg-white overflow-hidden">
        <!--        <LuckItem :list="winList" @show="show()"></LuckItem> -->
        <view v-for="(item, index) in enterpriseList" :key="index" class="w-full p-2 box-border" @click="toDetails(item)">
          <view class="flex items-center">
            <van-image
              width="70"
              height="70"
              fit="contain"
              class="mr-2"
              :src="convertImageSize(item.brandLogo, 's')"
            />
            <view class="h-full w-full overflow-hidden">
              <view class="font-bold truncate w-2/3">
                {{ item.brandName }}({{ item.shopName }})
              </view>
              <view class="text-[#666] text-xs leading-loose">
                <view class="truncate w-2/3">
                  {{ item.address }}
                </view>
                <view class="flex justify-between">
                  <view>抽奖次数：{{ item.countNum || '无' }}</view>
                  <view>
                    {{ `离您: < ${item.shopDistance} km` }}
                  </view>
                </view>
              </view>
            </view>
          </view>
          <van-divider v-if="enterpriseList.length - 1 > index" />
        </view>
      </view>
    </view>
  </container>
</template>

<style lang="scss" scoped>
:deep(.van-image__img){
  border-radius: 8px;
}
:deep(.van-image){
  display: block
}
</style>
