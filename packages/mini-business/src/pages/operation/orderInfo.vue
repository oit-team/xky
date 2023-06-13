<script>
import { addActivityOrderConfirm, getActivityProcureOrderById } from '@/api/luck'

export default {
  data: () => ({
    info: {},
    pms: false,
    id: '',
  }),
  onLoad(opt) {
    if (opt.id)
      this.id = opt.id
    this.getInfo(opt.id)
  },
  methods: {
    async getInfo(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const { body } = await getActivityProcureOrderById({
        activityOrderId: id,
      }).finally(() => this.$toast.clear())
      this.info = body
      this.pms = true
    },
    async submit() {
      await this.$dialog.confirm({
        title: '提示',
        message: '确认执行该操作吗？',
      })
      await addActivityOrderConfirm({
        activityOrderId: this.id,
        orderStatus: 3,
      })

      this.$toast.success('成功')
      setTimeout(() => { uni.navigateBack() }, 300)
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100 p-2 box-border text-sm">
    <view v-if="!pms" class="w-full bg-white flex-1 pt-4 box-border">
      <van-skeleton title row="3" class="h-full" />
    </view>
    <view v-if="pms" class="w-full flex-1">
      <view class="p-2 py-3 box-border rounded bg-white grid grid-cols-1 gap-2 text-sm">
        <view class="text-sm font-600 ">
          订单信息
        </view>
        <view>
          <span class="text-[#888] text-xs">订单编号：</span>{{ info.activityOrderNo || '暂无' }}
        </view>
        <view>
          <span class="text-[#888] text-xs">订单状态：</span>{{ info.orderStatus || '暂无' }}
        </view>
        <view>
          <span class="text-[#888] text-xs">下单时间：</span>{{ info.orderCreateTime || '暂无' }}
        </view>
      </view>

      <view class="p-2 py-3 mt-2 box-border rounded bg-white grid grid-cols-1 gap-2 text-sm">
        <view class="text-sm font-bold">
          配送信息
        </view>
        <view>
          <span class="text-[#888] text-xs">收货店铺：</span>{{ info.procureShopAddress || '暂无' }}
        </view>
        <view>
          <span class="text-[#888] text-xs">联系方式：</span>{{ info.procureShopPhone || '暂无' }}
        </view>
        <view>
          <span class="text-[#888] text-xs">收货地址：</span>{{ info.procureShopName || '暂无' }}
        </view>
      </view>

      <view class="p-2 box-border rounded bg-white grid grid-cols-1 gap-2 mt-2">
        <view
          v-for="item in info.activityOrderDetail"
          :key="item.supplierShopId"
          class="w-full flex"
        >
          <van-image :src="item.impUrl" width="60" height="60" class="rounded mr-2" />
          <view class="flex-1 text-[#888] text-xs">
            <view class="text-[#000] text-sm">
              {{ item.vouchersName }}（{{ item.supplierShopName }}）
            </view>
            <view class="flex justify-between">
              <view class="text-red-500">
                ￥{{ item.jackpotBuyPrice || '0' }}
              </view>
              <view>
                × {{ item.jackpotNumber || '0' }}
              </view>
            </view>
            <view>
              有效期：{{ item.periodValidity || '0' }}
            </view>
          </view>
        </view>
      </view>

      <view v-if="info.orderStatusKey !== 3" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border z-20">
        <van-button color="#f9591d" block round @click="submit()">
          确认
        </van-button>
      </view>
    </view>
  </container>
</template>

<style lang='scss' scoped>
::v-deep van-image{
  display: flex;
}
</style>
