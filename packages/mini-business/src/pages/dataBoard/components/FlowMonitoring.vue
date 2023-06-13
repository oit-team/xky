<script>
export default {
  data() {
    return {
      today: 0,
      yestDay: 0,
      chartData: {
        categories: [],
        series: [],
      },
      opts: {
        padding: [15, 10, 0, 15],
        enableScroll: false,
        xAxis: {
          disableGrid: true,
          rotateLabel: true,
          rotateAngle: 35,
          marginTop: 8,
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
        },
      },
    }
  },
  methods: {
    async loadData() {
      const res = await this.$post('/liveBroadcast/report/getPeopleTraffic')
      this.today = res.body.today
      this.yestDay = res.body.yestDay
      this.chartData = {
        categories: res.body.xList.reverse(),
        series: [
          {
            name: '流量',
            data: res.body.yList,
          },
        ],
      }
    },
  },
}
</script>

<template>
  <view>
    <view class="w-full grid grid-cols-2 gap-3 py-2">
      <view class="bg-[#f2f2f2] text-center py-2">
        <view>
          今日流量
        </view>
        <view class="color-[#28b3eb] font-600 mt-2 flex justify-center items-center">
          <image
            v-if="today - yestDay"
            :src="today >= yestDay ? '/static/image/top.png' : '/static/image/down.png'"
            class="w-1em h-1em"
          />
          <span>{{ today }}</span>
        </view>
      </view>
      <view class="bg-[#f2f2f2] text-center py-2">
        <view>
          昨日流量
        </view>
        <view class="color-[#28b3eb] font-600 mt-2">
          {{ yestDay }}
        </view>
      </view>
    </view>
    <qiun-data-charts
      type="line"
      :opts="opts"
      :chart-data="chartData"
    />
  </view>
</template>
