<script>
import dataCard from './components/card'
import * as api from '@/api/data.js'

export default {
  components: {
    DataCard: dataCard,
  },
  data: () => ({
    service: [
      {
        key: 'incompleteCount',
        title: '未完成',
      },
      {
        key: 'todayReservation',
        title: '今日预约人数',
      },
      {
        key: 'theMonth',
        title: '当月预约人数',
      },
      {
        key: 'lastMonth',
        title: '上月预约人数',
      },
    ],
    luck: [
      {
        key: 'dailyLottery',
        title: '每日抽奖',
      },
      {
        key: 'activityLottery',
        title: '活动抽奖',
      },
      {
        key: 'dailyLotteryVerification',
        title: '每日抽奖核销',
      },
      {
        key: 'activityLotteryVerification',
        title: '活动核销',
      },
    ],
    luckData: {},
    serviceData: {},
    flowData: {},
  }),
  async onShow() {
    await this.$store.state.userPromise

    this.getLotteryInteraction()
    this.getAppointmentReport()
  },
  methods: {
    async getLotteryInteraction() {
      const { body } = await api.getLotteryInteraction()

      this.luckData = body
    },
    async getAppointmentReport() {
      const { body } = await api.getAppointmentReport()

      this.serviceData = body.result
    },
    toWrite() {
      uni.navigateTo({
        url: '/pages/activity/writeOff',
      })
    },
    toOrder() {
      uni.navigateTo({
        url: '/pages/serviceOrder/orderList',
      })
    },
  },
}
</script>

<template>
  <container classes="flex flex-col bg-gray-100">
    <view class="w-full flex-1 p-2 box-border grid grid-cols-1 gap-2 text-sm">
      <data-card>
        <template #left-title>
          服务预约
        </template>
        <template #right-title>
          <view class="text-[#888]" @click="toOrder">
            查看更多
            <van-icon name="arrow" size="12" />
          </view>
        </template>
        <template #content>
          <view class="w-full grid grid-cols-2 gap-3 pt-2">
            <view v-for="item in service" :key="item.key" class="bg-[#f2f2f2] text-center py-2">
              <view>
                {{ item.title }}
              </view>
              <view class="text_blue flex justify-center mt-2">
                <template v-if="item.key === 'todayReservation'">
                  <image v-if="serviceData.momDay === 2" :src="require('@/static/image/top.png')" class="w-20px h-16px" />
                  <image v-if="serviceData.momDay === 0" :src="require('@/static/image/done.png')" class="w-20px h-16px" />
                </template>
                <template v-if="item.key === 'theMonth'">
                  <image v-if="serviceData.momMonth === 2" :src="require('@/static/image/top.png')" class="w-20px h-16px" />
                  <image v-if="serviceData.momMonth === 0" :src="require('@/static/image/done.png')" class="w-20px h-16px" />
                </template>
                <view class="font-600">
                  {{ serviceData[item.key] || 0 }}
                </view>
              </view>
            </view>
          </view>
        </template>
      </data-card>

      <data-card>
        <template #left-title>
          抽奖互动
        </template>
        <template #right-title>
          <view class="text-[#888]" @click="toWrite">
            查看更多
            <van-icon name="arrow" size="12" />
          </view>
        </template>
        <template #content>
          <view class="w-full grid grid-cols-2 gap-3 pt-2">
            <view v-for="item in luck" :key="item.key" class="bg-[#f2f2f2] text-center py-2">
              <view>
                {{ item.title }}
              </view>
              <view class="text_blue font-600 mt-2">
                {{ luckData[item.key] || 0 }}
              </view>
            </view>
          </view>
        </template>
      </data-card>

      <!-- <data-card>
        <template #left-title>
          流量监测<span class="text-xs text-[#333]">(近7日)</span>
        </template>
        <template #content>
          <view class="w-full grid grid-cols-2 gap-3 pt-2">
            5555
          </view>
        </template>
      </data-card> -->
    </view>
  </container>
</template>

<style lang='scss' scoped>
.text_blue{
  color: #28b3eb;
}
</style>
