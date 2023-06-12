<script>
import { getNearbyMerchants } from '@/api/nearby'
import { convertImageSize } from '@/utils/helper'
import notLogged from '@/components/business/notLogged/notLogged'
import { hasToken } from '@/utils/token'
import { getDictItemList } from '@/api/system'
import ScrollBtm from '@/components/business/ScrollBtm/ScrollBtm'
import ShopItem from '@/components/business/ShopItem/ShopItem'

export default {
  components: {
    NotLogged: notLogged,
    ScrollBtm,
    ShopItem,
  },
  data() {
    return {
      enterpriseList: [],
      showEmpty: true,
      y: 0,
      x: 0,
      formData: {
        pageNum: 1,
        pageSize: 20,
        // shopName: '',
        industryId: 1,
        // address: '',
        startDistance: 0,
        endDistance: 2,
      },
      showPopup: false,
      active: 0,
      dictItemList: [],
      canReload: true,
      active2: 0,
      positionList: [{
        num: 2,
        title: '默认',
      },
      {
        num: 1,
        title: '1km',
      }, {
        num: 3,
        title: '3km',
      }, {
        num: 5,
        title: '5km',
      }, {
        num: 10,
        title: '10km',
      },
      ],
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
    shopName() {
      return this.formData.shopName
    },
  },
  watch: {
  },
  async onShow() {
    if (!hasToken())
      return

    await this.$store.state.userPromise
    await this.getDictItemList()
    await this.getLocation()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (!this.canReload)
      return
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    convertImageSize,

    async getDictItemList() {
      const res = await getDictItemList({
        dictCode: 'INDUSTRY_CATEGORY',
      })
      this.dictItemList = res.body.resultList
      this.dictItemList.forEach((item) => {
        item.url = 'https://picsum.photos/200/200'
      })
    },
    async getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getNearbyMerchants({
        userId: this.$store.state.userInfo.id,
        lng: this.y,
        lat: this.x,
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.enterpriseList = res.body.nearbyMerchants
      this.showEmpty = res.body.nearbyMerchants.length === 0
      this.canReload = res.body.nearbyMerchants.length === this.formData.pageSize
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getNearbyMerchants({
        userId: this.$store.state.userInfo.id,
        lng: this.y,
        lat: this.x,
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.enterpriseList = [...this.enterpriseList, ...res.body.nearbyMerchants]
      this.canReload = res.body.nearbyMerchants.length === this.formData.pageSize
    },
    toDetails(item) {
      uni.navigateTo({
        url: `/pages/nearby/details?id=${item.shopId}`,
      })
    },

    getLocation() {
      // 获取用户是否开启 授权获取当前的地理位置、速度的权限。
      uni.getSetting({
        success: (res) => {
          // 如果没有授权
          if (!res.authSetting['scope.userFuzzyLocation']) {
            // 则拉起授权窗口
            uni.authorize({
              scope: 'scope.userFuzzyLocation',
              success: () => {
                // 点击允许后--就一直会进入成功授权的回调 就可以使用获取的方法了
                wx.getFuzzyLocation({
                  type: 'wgs84',
                  success: (res) => {
                    this.y = res.longitude
                    this.x = res.latitude
                    this.getData()
                  },
                  fail: () => {
                    this.$toast.fail('失败')
                  },
                })
              },
              fail: () => {
                // 点击了拒绝授权后--就一直会进入失败回调函数--此时就可以在这里重新拉起授权窗口
                // console.log('拒绝授权', error)

                this.$dialog.confirm({
                  title: '提示',
                  message: '若点击不授权，将无法使用位置功能',
                  confirmButtonText: '授权',
                  cancelButtonText: '拒绝',
                  confirmButtonColor: '#000',
                  cancelButtonColor: '#f94218',
                })
                  .then((res) => {
                    // 选择弹框内授权
                    uni.openSetting({
                      success(res) {
                        // console.log(res.authSetting)
                      },
                    })
                  })
                  .catch(() => {
                    // 选择弹框内 不授权
                    this.$toast.fail('用户点击不授权')
                  })
              },
            })
          }
          else {
            // 有权限则直接获取
            this.$toast.loading({
              message: '加载中...',
              forbidClick: true,
              duration: 0,
            })
            setTimeout(() => {
              wx.getFuzzyLocation({
                type: 'wgs84',
                success: (res) => {
                  this.y = res.longitude
                  this.x = res.latitude
                  this.getData()
                },
                fail: () => {
                  this.$toast.fail('请勿频繁调用！')
                },
              })
              this.$toast.clear()
            }, 300)
          }
        },
      })
    },
    onChange(e) {
      this.active = e.detail.name
      this.formData.industryId = e.detail.name
      this.getData()
    },
    filterForm() {
      this.showPopup = true
    },
    changePosition(e) {
      this.formData.endDistance = e
    },
    submit() {
      this.showPopup = false
      this.getData()
    },
    onSearch(e) {
      this.formData.shopName = e.detail
    },
  },
}
</script>

<template>
  <container classes="flex flex-col bg-neutral-100 text-sm">
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged @login="getLocation()" />
    </view>
    <view v-else class="w-full flex flex-col flex-1">
      <view class="text-xs w-full">
        <van-tabs :active="active" :swipe-threshold="4" color="#6FA7FF" @change="onChange">
          <van-tab v-for="item in dictItemList" :key="item.id" :title="item.name" :name="item.id" />
          <template #nav-right>
            <view class="w-10 bg-[#f7f8fa] flex justify-center items-centert" @click="filterForm()">
              <van-icon name="filter-o" size="16" />
            </view>
          </template>
        </van-tabs>
      </view>
      <view v-if="showEmpty" class="w-full flex-1">
        <van-empty description="暂无数据" />
      </view>
      <view v-else class="w-full h-full">
        <view class="flex h-full flex-col p-2 box-border">
          <view v-for="(item, index) in enterpriseList" :key="index" class="w-full mb-2" @click="toDetails(item)">
            <shop-item :item="item" />
          </view>
          <scroll-btm :can-reload="canReload" />
        </view>
      </view>
    </view>

    <view class="fixed bottom-4 right-4">
      <view class="bg-[#1296db] w-8 h-8 backTop rounded-1/2 flex place-content-center" @click="getLocation()">
        <van-icon name="aim" color="#fff" />
      </view>
    </view>

    <van-popup
      :show="showPopup"
      position="top"
      round
      @close="showPopup = false"
    >
      <view class="w-full p-2 box-border">
        <view class="w-full">
          <van-search
            :value="shopName"
            placeholder="请输入搜索关键词"
            @search="onSearch"
          />
        </view>

        <view class="flex justify-around w-full my-2">
          <view
            v-for="item in positionList"
            :key="item.num"
            class="bg-[#f8f8f8] text-xs p-2 box-border rounded"
            :class="[item.num === formData.endDistance ? 'bg-[#6FA7FF] text-[#fff]' : '']"
            @click="changePosition(item.num)"
          >
            {{ item.title }}
          </view>
        </view>

        <view class="text-center mt-2" @click="submit()">
          <van-button color="#6FA7FF" block>
            查询
          </van-button>
        </view>
      </view>
    </van-popup>
  </container>
</template>

<style lang="scss" scoped>
::v-deep .van-image__img{
  border-radius: 8px;
}
::v-deep .van-image{
  display: block
}
</style>
