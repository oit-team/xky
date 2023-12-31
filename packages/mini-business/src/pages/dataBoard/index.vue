<script>
import { hasToken } from '../../utils/token'
import dataCard from './components/card'
import FlowMonitoring from './components/FlowMonitoring.vue'
import TrendInterest from './components/TrendInterest.vue'
import { getAppointmentReport, getLotteryInteraction } from '@/api/data.js'

export default {
  components: {
    DataCard: dataCard,
    FlowMonitoring,
    TrendInterest,
  },
  data: () => ({
    service: [
      {
        key: 'incompleteCount',
        title: '待核销',
        to: '/pages/serviceOrder/orderList?tab=2',
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
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  async onShow() {
    await this.$store.state.userPromise
    if (!this.logged)
      return
    uni.setNavigationBarTitle({
      title: this.$store.state.userInfo.shopName,
    })
    this.getLottery()
    this.getAppointment()
    this.$refs.flowMonitoring.loadData()
    this.$refs.trendInterest.loadData()
  },
  methods: {
    async getLottery() {
      const { body } = await getLotteryInteraction()

      this.luckData = body
    },
    async getAppointment() {
      const { body } = await getAppointmentReport()

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
    clickServiceItem(item) {
      if (item.to) {
        uni.navigateTo({
          url: item.to,
        })
      }
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
            <view v-for="item in service" :key="item.key" class="bg-[#f2f2f2] text-center py-2" @click="clickServiceItem(item)">
              <view>
                {{ item.title }}
              </view>
              <view class="text_blue flex justify-center mt-2">
                <view v-if="item.key === 'todayReservation'">
                  <image v-if="serviceData.momDay === 2" :src="require('@/static/image/top.png')" class="w-20px h-20px" />
                  <image v-if="serviceData.momDay === 0" :src="require('@/static/image/down.png')" class="w-20px h-20px" />
                </view>
                <view v-if="item.key === 'theMonth'">
                  <image v-if="serviceData.momMonth === 2" :src="require('@/static/image/top.png')" class="w-20px h-20px" />
                  <image v-if="serviceData.momMonth === 0" :src="require('@/static/image/down.png')" class="w-20px h-20px" />
                </view>
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

      <data-card>
        <template #left-title>
          流量监测<span class="text-xs text-[#333]">(近7日)</span>
        </template>
        <template #content>
          <div class="pt-2">
            <flow-monitoring ref="flowMonitoring" />
          </div>
        </template>
      </data-card>

      <data-card>
        <template #left-title>
          用户感兴趣趋势<span class="text-xs text-[#333]">(近7日)</span>
        </template>
        <template #right-title>
          <view class="text-[#888]" @click="uni.navigateTo({ url: '/pages/my/largeList' })">
            查看更多
            <van-icon name="arrow" size="12" />
          </view>
        </template>
        <template #content>
          <div class="pt-2">
            <trend-interest ref="trendInterest" />
          </div>
        </template>
      </data-card>
    </view>
  </container>
</template>

<style lang='scss' scoped>
.text_blue{
  color: #28b3eb;
}
</style>
