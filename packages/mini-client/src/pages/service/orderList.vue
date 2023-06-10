<script>
import { getServiceOrderListForWeChatC } from '@/api/system'

export default {
  components: {
  },
  data() {
    return {
      contentHeight: '',
      showEmpty: true,
      refresherTriggered: false,
      serviceOrderInfoList: [],
      tagList: [],
      searchValue: '',
      activeTab: 0,
      formData: {
        pageNum: 1,
        pageSize: 20,
      },
      notReload: true,
    }
  },
  async onShow() {
    if (this.logged) {
      const { windowHeight } = uni.getWindowInfo()
      this.contentHeight = windowHeight - 100

      await this.$store.state.userPromise
      this.getData()
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  methods: {
    async getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceOrderListForWeChatC({
        searchContent: this.searchValue,
        status: this.activeTab,
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.serviceOrderInfoList = [...res.body.serviceOrderInfoList]
      this.showEmpty = this.serviceOrderInfoList.length <= 0
      this.notReload = res.body.serviceOrderInfoList.length < this.formData.pageSize
    },

    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceOrderListForWeChatC({
        searchContent: this.searchValue,
        status: this.activeTab,
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.serviceOrderInfoList = [...this.serviceOrderInfoList, ...res.body.serviceOrderInfoList]
      this.notReload = res.body.serviceOrderInfoList.length < this.formData.pageSize
    },

    search(e) {
      this.searchValue = e.detail
      this.getData()
    },

    async searchClear() {
      this.searchValue = ''
      await this.getData()
    },

    async handleScrolltolower() {
      this.formData.pageNum++
      await this.reload()
    },

    handleChangeTab(e) {
      this.formData.pageNum = 1
      this.activeTab = e.detail.name
      this.getData()
    },

    goToDetailPage(itemId) {
      uni.navigateTo({
        url: `/pages/serviceOrder/orderDetail?id=${itemId}`,
      })
    },

    async handleRefresherrefresh() {
      this.searchValue = ''
      this.formData.pageNum = 1
      this.refresherTriggered = true

      await this.getData()
      setTimeout(() => {
        this.refresherTriggered = false
      }, 500)
    },

  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <van-search
      class="w-full mb-2"
      shape="round"
      :value="searchValue"
      placeholder="请输入用户名/手机号/服务名称"
      :use-left-icon-slot="true"
      @search="search"
      @clear="searchClear"
    />
    <view class="w-full">
      <van-tabs :active="activeTab" color="#6FA7FF" @change="handleChangeTab">
        <van-tab title="全部" :name="0" />
        <van-tab title="待付款" :name="1" />
        <van-tab title="待核销" :name="2" />
        <van-tab title="已完成" :name="3" />
      </van-tabs>
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
      <view v-if="!showEmpty" class="px-2 mt-2">
        <view v-for="(item, index) in serviceOrderInfoList" :key="index" class="p-2 bg-white rounded-md flex items-center mb-2" @click="goToDetailPage(item.id)">
          <van-image class="mr-1" width="80" height="80" radius="5" :src="item.resourceUrl" />
          <view class="w-full ml-2 flex-1 flex overflow-hidden">
            <view class="flex-1 flex flex-col overflow-hidden">
              <p class="w-full truncate font-sans font-bold">
                {{ item.serviceName }}
              </p>
              <p class="w-full truncate text-xs mt-4 text-gray-500">
                <span class="text-xs">备注：</span>
                <span>{{ item.remarks || '暂无' }}</span>
              </p>
              <view class="flex text-xs mt-4 text-gray-500">
                <span>下单时间：</span>
                <span>{{ item.createTime }}</span>
              </view>
            </view>
            <view class="shrink-0 flex flex-col items-end justify-space">
              <van-tag v-if="item.status === 1" type="warning">
                {{ item.statusName }}
              </van-tag>
              <van-tag v-if="item.status === 2" type="danger">
                {{ item.statusName }}
              </van-tag>
              <van-tag v-if="item.status === 3" type="success">
                {{ item.statusName }}
              </van-tag>
              <view class="flex text-red-500 items-center pr-1 mt-4">
                <span class="text-xs">￥</span>
                <span>{{ item.payAmount }}</span>
              </view>
            </view>
          </view>
        </view>
        <view v-if="notReload" class="text-xs text-gray-500 pb-2 flex justify-center">
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
