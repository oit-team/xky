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
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
        },
      },
    }
  },
  async mounted() {
    await this.$store.state.userPromise && this.getServerData()
  },
  methods: {
    async getServerData() {
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
  <view class="">
    <qiun-data-charts
      type="line"
      :opts="opts"
      :chart-data="chartData"
    />
  </view>
</template>

<style scoped>
  /* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
  .charts-box {
    width: 100%;
    height: 300px;
  }
</style>
