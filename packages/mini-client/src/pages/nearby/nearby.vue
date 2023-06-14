<script>
import { getNearbyMerchants } from '@/api/nearby'
import { convertImageSize } from '@/utils/helper'
import notLogged from '@/components/business/notLogged/notLogged'
import { hasToken } from '@/utils/token'
import { getDictItemList } from '@/api/system'
import ShopItem from '@/components/business/ShopItem/ShopItem'

export default {
  components: {
    NotLogged: notLogged,
    ShopItem,
  },
  data() {
    return {
      enterpriseList: [],
      showEmpty: true,
      y: 0,
      x: 0,
      formData: {
        // shopName: '',
        industryId: 1,
        // address: '',
        startDistance: 0,
        endDistance: 10,
      },
      showPopup: false,
      active: 0,
      dictItemList: [],
      canReload: true,
      active2: 0,
      positionList: [{
        num: 10,
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
      }],
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
  },
  methods: {
    convertImageSize,
    loadData({ page, next, done, fail }) {
      this.getData(page)
        .then(isDone => isDone ? done() : next())
        .catch(fail)
    },
    async reload() {
      await this.$nextTick()
      this.$refs.list.reset().load()
    },
    async getDictItemList() {
      const res = await getDictItemList({
        dictCode: 'INDUSTRY_CATEGORY',
      })
      this.dictItemList = res.body.resultList
      this.dictItemList.forEach((item) => {
        item.url = 'https://picsum.photos/200/200'
      })
      // this.getLocation()
    },
    async getData(pageNum = 1) {
      if (pageNum === 1)
        this.enterpriseList = []
      // if (this.y === 0 && this.x === 0)
      //   return

      const res = await getNearbyMerchants({
        userId: this.$store.state.userInfo.id,
        lng: this.y,
        lat: this.x,
        pageNum,
        pageSize: 20,
        ...this.formData,
      })
      this.enterpriseList = pageNum === 1 ? res.body.nearbyMerchants : [...this.enterpriseList, ...res.body.nearbyMerchants]
      this.showEmpty = res.body.nearbyMerchants.length === 0
      return res.body.count <= this.enterpriseList.length
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
          console.log(res)
          // 如果没有授权
          if (!res.authSetting['scope.userFuzzyLocation']) {
            console.log(888)
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
                    this.reload()
                  },
                  fail: () => {
                    this.$toast.fail('失败')
                  },
                })
              },
              fail: () => {
                this.$dialog.confirm({
                  title: '提示',
                  message: '点击授权查看当前位置店铺信息',
                  confirmButtonText: '授权',
                  cancelButtonText: '拒绝',
                  confirmButtonColor: '#000',
                  cancelButtonColor: '#f94218',
                })
                  .then((res) => {
                    uni.openSetting({
                      success(res) {
                        console.log(res.authSetting)
                      },
                    })
                  })
                  .catch(() => {
                    this.$toast.fail('拒绝授权，无法获取附近信息')
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
                  this.reload()
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
      this.reload()
    },
    filterForm() {
      this.showPopup = true
    },
    changePosition(e) {
      this.formData.endDistance = e
    },
    submit() {
      this.showPopup = false
      this.reload()
    },
    onSearch(e) {
      this.formData.shopName = e.detail
    },
    login() {
      this.getDictItemList()
      setTimeout(() => {
        this.getLocation()
      }, 400)
    },
  },
}
</script>

<template>
  <container classes="flex flex-col h-screen bg-neutral-100 text-sm overflow-hidden">
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged @login="login()" />
    </view>
    <view v-else class="w-full flex flex-col flex-1 overflow-hidden pb-50px">
      <view class="text-xs w-full">
        <van-tabs :active="active" :swipe-threshold="3" color="#6FA7FF" @change="onChange">
          <van-tab v-for="item in dictItemList" :key="item.id" :title="item.name" :name="item.id" />
          <template #nav-right>
            <view class="w-10 bg-[#f7f8fa] flex justify-center items-centert" @click="filterForm()">
              <van-icon name="filter-o" size="16" />
            </view>
          </template>
        </van-tabs>
      </view>
      <vc-list
        ref="list"
        load-more
        pull-refresh
        @refresh="loadData"
        @load="loadData"
      >
        <view class="flex flex-col p-2 box-border">
          <view v-for="(item, index) in enterpriseList" :key="index" class="w-full mb-2" @click="toDetails(item)">
            <shop-item :item="item" />
          </view>
        </view>
      </vc-list>
    </view>

    <view class="fixed bottom-4 right-4">
      <button class="bg-[#1296db] w-8 h-8 backTop rounded-1/2 flex place-content-center" open-type="getUserInfo" @tap="getLocation()">
        <van-icon name="aim" color="#fff" />
      </button>
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
