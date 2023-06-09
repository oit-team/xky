<script>
import dataCard from './components/card'

export default {
  components: {
    DataCard: dataCard,
  },
  data: () => ({

  }),
  async onShow() {
    // await this.$store.state.userPromise
  },
  methods: {
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
          <view class="text-[#888]">
            查看更多
            <van-icon name="arrow" size="12" />
          </view>
        </template>
        <template #content>
          5555
        </template>
      </data-card>

      <data-card>
        <template #left-title>
          抽奖互动
        </template>
      </data-card>

      <data-card>
        <template #left-title>
          流量监测<span class="text-xs">(近7日)</span>
        </template>
      </data-card>

      <data-card>
        <template #left-title>
          服务预约
        </template>
      </data-card>
    </view>
  </container>
</template>

<style lang='scss' scoped>

</style>
