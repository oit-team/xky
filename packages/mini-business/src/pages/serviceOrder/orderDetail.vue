<script>
import { getServiceOrderDetail } from '@/api/service'
export default {
  components: {
  },
  data() {
    return {
      serviceOrderInfo: {},
      id: '',
    }
  },
  onLoad(params) {
    this.id = params.id
  },
  onShow() {
    this.getServiceOrderDetail()
  },
  computed: {
  },
  methods: {
    async getServiceOrderDetail() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceOrderDetail({
        id: this.id,
      }).finally(() => this.$toast.clear())
      this.serviceOrderInfo = res.body.serviceOrderInfo
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <view v-if="Object.keys(serviceOrderInfo).length > 0" class="w-full">
      <view class="p-2">
        <view class="font-bold text-lg mb-2">
          {{ serviceOrderInfo.statusName }}
        </view>
        <view class="bg-white rounded-md p-2">
          <view class="font-bold">
            端午节活动
          </view>
          <van-divider />

          <view class="flex">
            <van-image class="mr-2" width="50" height="50" radius="5" :src="serviceOrderInfo.resourceUrl" />
            <view class="flex-1 flex justify-between">
              <view class="flex-1 flex flex-col flex-wrap grow-0 overflow-hidden">
                <p class="w-full truncate text-sm">
                  {{ serviceOrderInfo.serviceName }}
                </p>
                <p class="text-gray-500 text-xs mt-2">
                  预约时间: {{ serviceOrderInfo.appointmentTime }}
                </p>
              </view>
              <view class="shrink-0 text-xs">
                ￥<span class="text-sm">{{ serviceOrderInfo.payAmount }}</span>
              </view>
            </view>
          </view>
        </view>
        <view class="bg-white grid gap-4 rounded-md p-2 text-xs mt-2">
          <view class="flex justify-between">
            <view class="text-gray-500">
              备注
            </view>
            <view>{{ serviceOrderInfo.remarks }}</view>
          </view>
          <view class="flex justify-between">
            <view class="text-gray-500">
              用户名
            </view>
            <view>{{ serviceOrderInfo.userName }}</view>
          </view>
          <view class="flex justify-between">
            <view class="text-gray-500">
              手机号
            </view>
            <view>{{ serviceOrderInfo.telephone }}</view>
          </view>
          <view class="flex justify-between">
            <view class="text-gray-500">
              下单时间
            </view>
            <view>{{ serviceOrderInfo.createTime }}</view>
          </view>
        </view>
      </view>
    </view>
    <van-empty v-else description="暂无数据" />
  </container>
</template>

<style scoped>
</style>
