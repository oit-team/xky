<script>
import * as api from '@/api/system'

export default {
  data() {
    return {
      shopId: '',
      shopInfo: {},
    }
  },
  computed: {
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
      const res = await api.getShopById({
        shopId: this.shopId,
      })
      this.shopInfo = res.body
    },
  },
}
</script>

<template>
  <container classes="flex flex-col text-gray-500 bg-neutral-100 text-sm p-2 box-border">
    <view class="w-full">
      <img
        width="300"
        height="150"
        class="w-full block rounded-md"
        src="https://fastly.picsum.photos/id/83/400/300.jpg?hmac=dS4AO2SFni3pjmqaCDFDMjp2D3_khiC870j9F6OSauU"
        alt=""
      >
    </view>
    <view class="w-full flex-1 bg-red-100 py-3 px-2 box-border">
      <view class="bg-white rounded-md h-3em flex items-center px-2 box-border">
        <view>
          湾举行
        </view>
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
