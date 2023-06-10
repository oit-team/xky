<script>
import { getServiceInfos } from '@/api/shop'

export default {
  props: {
    shopId: String,
  },
  data: () => ({
    serviceList: [],
    showEmpty: true,
    formData: {
      pageSize: 20,
      pageNum: 1,
    },
    refresherTriggered: false,
    contentHeight: '',
  }),
  mounted() {
    const { windowHeight } = uni.getWindowInfo()
    this.contentHeight = windowHeight - 100
    this.getServiceInfo()
  },
  methods: {
    async getServiceInfo() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceInfos({
        name: this.searchValue,
        content: '',
        remarks: '',
        shopId: this.shopId,
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.serviceList = [...res.body.advertsList]
      this.showEmpty = this.serviceList.length <= 0
    },

    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceInfos({
        name: this.searchValue,
        content: '',
        remarks: '',
        shopId: this.shopId,
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.serviceList = [...this.serviceList, ...res.body.advertsList]
    },
    async handleScrolltolower() {
      this.formData.pageNum++
      await this.reload()
    },

    async handleRefresherrefresh() {
      this.searchValue = ''
      this.formData.pageNum = 1
      this.refresherTriggered = true

      await this.getServiceInfo()
      setTimeout(() => {
        this.refresherTriggered = false
      }, 500)
    },
    goToDetailPage(itemId) {
      uni.navigateTo({
        url: `/pages/service/serviceDetail?id=${itemId}`,
      })
    },
    search(e) {
      this.searchValue = e.detail
      this.getServiceInfo()
    },

    async searchClear() {
      this.searchValue = ''
      await this.getServiceInfo()
    },
  },
}
</script>

<template>
  <view>
    <view class="mt-2">
      <van-search
        class="w-full"
        shape="round"
        :value="searchValue"
        placeholder="请输入搜索服务名称"
        @search="search"
        @clear="searchClear"
      />
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
      <view v-if="serviceList.length > 0" class="mt-2">
        <view v-for="(item, index) in serviceList" :key="index" class="p-2 bg-white rounded-md flex items-center mb-2" @click="goToDetailPage(item.id)">
          <van-image class="mr-2" width="100" height="100" radius="5" :src="item.resourceUrl" />
          <view class="flex-1 grid gap-2 flex flex-col h-100px overflow-hidden">
            <p class="truncate text-base font-600">
              {{ item.name }}
            </p>
            <view class="text-sm truncate flex">
              <view v-if="item.labels">
                <van-tag
                  v-for="tag of item.labels.split(',')"
                  :key="tag"
                  class="mr-2"
                  type="warning"
                  color="#FFE5D4"
                  text-color="#F07623"
                >
                  {{ tag }}
                </van-tag>
              </view>
            </view>
            <p class="truncate text-xs text-gray-500">
              {{ item.content }}
            </p>
            <view class="flex justify-between">
              <view class="text-red-500">
                <van-tag
                  color="#FFE5D4"
                  text-color="#ef4444"
                  class="inline-block"
                >
                  预
                </van-tag>
                <span class="text-xs">￥</span>
                <span>{{ item.price }}</span>
              </view>
              <view />
            </view>
          </view>
        </view>
        <view v-if="serviceList.length > 6" class="text-xs text-gray-500 py-1 flex justify-center">
          没有更多了~
        </view>
      </view>
      <van-empty v-else description="暂未添加服务" />
    </scroll-view>
  </view>
</template>

<style lang='scss' scoped>

</style>
