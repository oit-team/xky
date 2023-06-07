<script>
import shopItem from './components/shopItem.vue'
import goodsItem from './components/goodsItem.vue'
import { hasToken } from '@/utils/token'
import { getDictItemList } from '@/api/system'
import * as api from '@/api/goods'
import NotLogged from '@/components/business/notLogged/notLogged'
import scrollBtm from '@/components/business/ScrollBtm/ScrollBtm'

export default {
  components: {
    NotLogged,
    ScrollBtm: scrollBtm,
    // ShopItem: shopItem,
    GoodsItem: goodsItem,
  },
  data() {
    return {
      data: {},
      active: 0,
      industryAll: [], // 行业列表
      services: [], // 服务列表
      products: [], // 商品列表
      formData: {
        pageSize: 20,
        pageNum: 1,
      },
      canReload: false,
      showEmpty: true,
      current: 0,
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  async onShow() {
    if (!hasToken())
      return

    await this.$store.state.userPromise
    this.getDictItemList()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getProducts()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (!this.canReload)
      return
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    async getDictItemList() {
      const res = await getDictItemList({
        dictCode: 'INDUSTRY_CATEGORY',
      })
      this.industryAll = res.body.resultList
      this.industryAll.forEach((item) => {
        item.url = 'https://picsum.photos/200/200'
      })
      this.getProducts()
    },
    async getProducts() {
      this.$toast.loading({
        duration: 60000,
        forbidClick: true,
        message: '加载中...',
      })
      const res = await api.getProducts(this.formData).finally(() => this.$toast.clear())
      this.products = res.body.resultList
      this.canReload = res.body.count > 20
      this.showEmpty = res.body.count === 0
    },
    async reload() {
      this.$toast.loading({
        duration: 60000,
        forbidClick: true,
        message: '加载中...',
      })
      const res = await api.getProducts(this.formData).finally(() => this.$toast.clear())
      this.products = [...this.products, ...res.body.resultList]
      this.canReload = res.body.count > this.products.length
    },
    change(e) {
      this.current = e.detail.current
    },
  },
}
</script>

<template>
  <container classes="bg-neutral-100 flex flex-col h-full">
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged class="w-full h-full" @login="getDictItemList()" />
    </view>
    <view v-if="logged" class="content w-full p-2 box-border">
      <!-- 顶部行业 -->
      <view class="w-auto h-300px flex flex-col gap-2 gap-y-1 justify-between flex-wrap p-2 box-border bg-white rounded overflow-hidden overflow-x-auto">
        <view v-for="item in industryAll" :key="item.id" class="rounded text-sm text-center">
          <view class="w-100px text-center">
            <image
              class="w-15 h-15 rounded"
              :src="item.url"
            />
            <view class="w-full truncate">
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>

      <!-- <view>
        <swiper
          indicator-dots
          :current="current"
          @change="change"
        >
          <swiper-item>
            <view>
              <view v-for="item in industryAll" :key="item.id" class="rounded text-sm text-center">
                <view class="w-100px text-center">
                  <image
                    class="w-15 h-15 rounded"
                    :src="item.url"
                  />
                  <view class="w-full truncate">
                    {{ item.name }}
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
          <swiper-item>Slide 2</swiper-item>
          <swiper-item>Slide 3</swiper-item>
        </swiper>
      </view> -->
      <!-- 商品 / 店铺 / 服务 -->
      <!-- <view class="mt-2">
        <van-tabs :active="active">
          <van-tab title="商品">
            <view v-if="showEmpty" class="w-full flex justify-center bg-white rounded">
              <van-empty />
            </view>
            <view v-else>
              <view class="p-2 box-border bg-white rounded grid grid-cols-2 gap-2">
                <goods-item v-for="item in products" :key="item.productId" :item="item" />
              </view>
              <scroll-btm :can-reload="canReload" />
            </view>
          </van-tab>
          <van-tab title="店铺">
            <view v-if="showEmpty" class="w-full flex justify-center bg-white rounded">
              <van-empty />
            </view>
            <view v-else>
              <view class="p-2 box-border bg-white rounded grid grid-cols-2 gap-2">
                <shop-item v-for="item in products" :key="item.productId" :item="item" />
              </view>
              <scroll-btm :can-reload="canReload" />
            </view>
          </van-tab>
          <van-tab title="服务">
            <view v-if="showEmpty" class="w-full flex justify-center bg-white rounded">
              <van-empty />
            </view>
            <view v-else>
              <view class="p-2 box-border bg-white rounded grid grid-cols-2 gap-2">
                <shop-item v-for="item in products" :key="item.productId" :item="item" />
              </view>
              <scroll-btm :can-reload="canReload" />
            </view>
          </van-tab>
        </van-tabs>
      </view> -->

      <view class="mt-2">
        <view v-if="showEmpty" class="w-full flex justify-center bg-white rounded">
          <van-empty />
        </view>
        <view v-else>
          <view class="p-2 box-border bg-white rounded grid grid-cols-2 gap-2">
            <goods-item v-for="item in products" :key="item.productId" :item="item" />
          </view>
          <scroll-btm :can-reload="canReload" />
        </view>
      </view>
    </view>
  </container>
</template>

<style scoped>
::v-deep van-image{
  display: flex;
}
</style>
