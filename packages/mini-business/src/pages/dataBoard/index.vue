<script>
import dataCard from './components/card'

export default {
  components: {
    DataCard: dataCard,
  },
  data: () => ({

  }),
  methods: {
  },
}
</script>

<template>
  <container classes="flex flex-col items-center">
    <view class="w-full flex-1">
      <data-card>
        <template #left-title>
          服务预约
        </template>
        44
      </data-card>
      <data-card>
        22
      </data-card>
      <data-card>
        66
      </data-card>
      <data-card>
        55
      </data-card>
    </view>
  </container>
</template>

<style lang='scss' scoped>

</style>
