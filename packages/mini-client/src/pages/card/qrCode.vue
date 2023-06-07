<script>
import { getConsumQrCode } from '@/api/luck'

export default {
  data() {
    return {
      imgUrl: '',
      recordId: '',
      cardInfo: {},
    }
  },
  onLoad(op) {
    this.cardInfo = JSON.parse(op.item)
    this.recordId = this.cardInfo.recordId
  },
  onShow() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getConsumQrCode({
        recordId: this.recordId,
      }, {
        responseType: 'ArrayBuffer',
      })
      this.imgUrl = `data:image/png;base64,${uni.arrayBufferToBase64(res)}`
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-neutral-100 p-2 box-border">
    <view class="w-full flex-1 flex flex-col bg-white rounded-xl p-2 box-border">
      <view class="w-full py-2 px-4 box-border font-semibold ">
        {{ cardInfo.vouchersName }}
      </view>
      <view class="w-full text-xs px-4 leading-6 text-gray-500/50">
        <view>
          {{ cardInfo.effectiveStart }}-{{ cardInfo.effectiveEnd }}
        </view>
        <view>
          备注：{{ cardInfo.vouchersNote || '暂无' }}
        </view>
        <view>
          来源：{{ cardInfo.fromName }}
        </view>
      </view>

      <van-divider dashed />

      <view class="flex flex-col items-center justify-center my-1">
        <img
          :src="imgUrl"
        >
        <view class="w-full text-center text-gray-500/50 text-sm">
          请出示以上二维码给商家工作人员
        </view>
      </view>
    </view>
  </container>
</template>

<style scoped>
img{
    width: 200px;
    height: 200px;
}
</style>
