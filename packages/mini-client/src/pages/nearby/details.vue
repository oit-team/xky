<script>
import Service from '../service/serviceList.vue'
import Operation from '../operation/operation.vue'
import Product from './../product/list.vue'
import ShopItem from '@/components/business/ShopItem/ShopItem.vue'
import { getShopById } from '@/api/system'

export default {
  components: {
    Service,
    Operation,
    ShopItem,
    Product,
  },
  data() {
    return {
      shopId: '',
      shopInfo: {},
      goodsForm: {
        pageSize: 20,
        pageNum: 1,
      },
      goodsList: [],
    }
  },
  computed: {
    // brandId() {
    //   return this.shopInfo?.brandId
    // },
  },
  watch: {
  },
  onLoad(option) {
    if (option.id)
      this.shopId = option.id
  },
  onShow() {
    this.getShopById()
  },
  methods: {
    async getShopById() {
      const res = await getShopById({
        shopId: this.shopId,
      })
      this.shopInfo = res.body.shopById
    },
  },
}
</script>

<template>
  <container classes="flex flex-col flex-1 bg-neutral-100 text-sm p-2 box-border">
    <view class="w-full h-full flex-1 flex flex-col box-border">
      <view class="bg-white rounded-md p-2 box-border">
        <shop-item :item="shopInfo" :show="false" />
      </view>

      <view class="rounded-md py-2 mt-2 flex-1 flex flex-col box-border">
        <van-tabs class="flex-1">
          <van-tab title="商品">
            <view class="mt-2">
              <product :brand-id="shopInfo.brandId" />
            </view>
          </van-tab>
          <van-tab title="服务">
            <service :shop-id="shopInfo.shopId" />
          </van-tab>
          <van-tab title="活动">
            <operation :shop-id="shopInfo.shopId" />
          </van-tab>
        </van-tabs>
      </view>
    </view>
  </container>
</template>

<style scoped>
::v-deep .van-image__img{
  border-radius: 8px;
}
::v-deep .van-image{
  display: block
}
</style>
