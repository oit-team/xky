<script>
import { addParticipateActivity, getActivityList } from '@/api/shop'

export default {
  props: { shopId: String },
  data: () => ({
    formData: {
      pageSize: 20,
      pageNum: 1,
      activityName: '',
      shopActivityType: 0,
    },
    activityList: [],
    canReload: true,
    isEmpty: true,
    refresherTriggered: false,
    contentHeight: '',
  }),
  computed: {
    activityName() {
      return this.formData.activityName
    },
  },
  mounted() {
    const { windowHeight } = uni.getWindowInfo()
    this.contentHeight = windowHeight - 100
    this.getData()
  },
  methods: {
    async getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const { body } = await getActivityList({
        ...this.formData,
        shopId: this.shopId,
      }).finally(() => this.$toast.clear())
      this.activityList = body.resultList
      this.isEmpty = body.resultList.length === 0
      this.canReload = body.count > this.formData.pageSize
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const { body } = await getActivityList({
        ...this.formData,
        shopId: this.shopId,
      }).finally(() => this.$toast.clear())
      this.activityList = [...this.activityList, ...body.resultList]
      this.canReload = body.count > this.activityList.length
    },
    async handleScrolltolower() {
      this.formData.pageNum++
      await this.reload()
    },

    async handleRefresherrefresh() {
      this.formData.pageNum = 1
      this.refresherTriggered = true

      await this.getData()
      setTimeout(() => {
        this.refresherTriggered = false
      }, 500)
    },
    toDetail(id) {
      uni.navigateTo({
        url: `/pages/operation/detail?activityId=${id}`,
      })
    },
    async onSearch(e) {
      this.formData.activityName = e.detail
      await this.getData()
    },
    async onClear() {
      this.formData.activityName = ''
      await this.getData()
    },
  },
}
</script>

<template>
  <view class="w-full h-full">
    <view class="mt-2">
      <van-search :value="activityName" placeholder="请输入活动名称" @search="onSearch" @clear="onClear" />
    </view>
    <scroll-view
      class="w-full"
      :style="{ height: `${contentHeight}px` }"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      @scrolltolower="handleScrolltolower"
      @refresherrefresh="handleRefresherrefresh"
    >
      <van-empty v-if="isEmpty" description="暂未发布活动" />
      <view v-else class="w-full py-2 pt-0 box-border">
        <view v-for="(item, index) in activityList" :key="index" class="mt-2 bg-white rounded-md p-2 box-border flex" @click="toDetail(item.activityId)">
          <view>
            <van-image width="60px" height="60px" :src="item.activityImg" class="rounded-md mr-2" />
          </view>
          <view class="flex flex-col justify-between w-full">
            <view class="font-600">
              {{ item.activityName }}
            </view>
            <view class="text-xs flex justify-between items-center">
              <view>
                {{ item.startDateTime }}至{{ item.endDateTime }}
              </view>
              <view v-if="active === 0 && item.activityStatusKey === 1" @click.stop>
                <van-button color="#f9591d" size="mini" round @click="join(item.activityId)">
                  立即参与
                </van-button>
              </view>
            </view>
          </view>
        </view>
        <view v-if="!canReload" class="text-xs text-gray-500 py-1 flex justify-center">
          没有更多了~
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang='scss' scoped>

</style>
