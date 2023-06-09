<script>
import { getServiceInfoList } from '@/api/service'
export default {
  components: {
  },
  data() {
    return {
      contentHeight: '',
      refresherTriggered: false,
      serviceList: [],
      tagList: [],
      searchValue: '',
      formData: {
        pageNum: 1,
        pageSize: 1,
      },
    }
  },
  async onShow() {
    const { windowHeight } = uni.getWindowInfo()
    this.contentHeight = windowHeight - 54

    await this.$store.state.userPromise
    this.getServiceInfo()
  },
  computed: {
  },
  methods: {
    async getServiceInfo() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceInfoList({
        name: this.searchValue,
        content: '',
        remarks: '',
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
      const res = await getServiceInfoList({
        name: this.searchValue,
        content: '',
        remarks: '',
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.serviceList = [...this.serviceList, ...res.body.advertsList]
    },

    search(e) {
      this.searchValue = e.detail
      this.getServiceInfo()
    },

    async searchClear() {
      this.searchValue = ''
      await this.getServiceInfo()
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
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <van-search
      class="w-full"
      shape="round"
      :value="searchValue"
      placeholder="请输入搜索服务名称"
      @search="search"
      @clear="searchClear"
    />
    <scroll-view
      class="w-full"
      :style="{ height: `${contentHeight}px` }"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      @scrolltolower="handleScrolltolower"
      @refresherrefresh="handleRefresherrefresh"
    >
      <view v-if="serviceList.length > 0" class="px-2 mt-2">
        <view v-for="(item, index) in serviceList" :key="index" class="p-2 bg-white rounded-md flex items-center mb-2" @click="goToDetailPage(item.id)">
          <van-image class="mr-2" width="100" height="100" radius="5" :src="item.resourceUrl" />
          <view class="flex-1 grid gap-2 flex flex-col h-100px overflow-hidden">
            <p class="truncate text-base font-bold">
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
      <van-empty v-else description="暂无数据" />
    </scroll-view>
  </container>
</template>

<style scoped>
::v-deep .van-image {
  display: block;
}
</style>
