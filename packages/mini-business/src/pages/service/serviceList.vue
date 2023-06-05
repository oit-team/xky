<script>
import { getServiceInfoList } from '@/api/service'
export default {
  components: {
  },
  data() {
    return {
      contentHeight: '',
      serviceList: [],
      searchValue: '',
    }
  },
  onShow() {
    const { windowHeight } = uni.getWindowInfo()
    console.log(windowHeight)
    this.contentHeight = windowHeight - 54
    this.getServiceInfoList()
  },
  computed: {
  },
  methods: {
    async getServiceInfoList() {
      const res = await getServiceInfoList({
        name: '',
        content: '',
        remarks: '',
        pageSize: 20,
        pageNum: 1,
      })
      this.serviceList = res.body.advertsList
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <van-search class="w-full" shape="round" :value="searchValue" placeholder="请输入搜索关键词" />
    <scroll-view
      class="w-full"
      :style="{ height: `${contentHeight}px` }"
      scroll-y="true"
      refresher-enabled="true"
    >
      <view class="px-2 mt-2">
        <view v-for="(item, index) in serviceList" :key="index" class="p-2 bg-white rounded-md flex items-center mb-2">
          <van-image class="mr-2" width="100" height="100" radius="5" :src="item.resourceUrl" />
          <view class="flex-1 flex flex-col justify-around h-100px">
            <p class="w-full truncate text-base font-bold">
              {{ item.name }}
            </p>
            <p class="text-sm">
              456
            </p>
            <p class="text-sm">
              <van-tag type="warning" color="#FFE5D4" text-color="#F07623">
                标签
              </van-tag>
            </p>
          </view>
        </view>
      </view>
    </scroll-view>
  </container>
</template>

<style scoped>
::v-deep .van-image {
  display: block;
}
</style>
