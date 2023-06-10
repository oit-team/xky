<script>
export default {
  data() {
    return {
      chartData: {},
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
      const res = await this.$post('/liveBroadcast/home/getInterested')
      this.chartData = {
        categories: res.body.resultList.map(item => item.time),
        series: [
          {
            name: '感兴趣趋势',
            data: res.body.resultList.map(item => item.value),
          },
        ],
      }
    },
  },
}
</script>

<template>
  <view>
    <qiun-data-charts
      type="line"
      :opts="opts"
      :chart-data="chartData"
    />
  </view>
</template>
