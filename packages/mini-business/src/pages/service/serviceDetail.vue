<script>
import { getServiceInfoDetail } from '@/api/service'
export default {
  components: {
  },
  data() {
    return {
      serviceInfo: {},
      id: '',
    }
  },
  onLoad(params) {
    this.id = params.id
  },
  onShow() {
    this.getServiceInfoDetail()
  },
  computed: {
  },
  methods: {
    async getServiceInfoDetail() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await getServiceInfoDetail({
        id: this.id,
      })
      this.$toast.clear()
      this.serviceInfo = res.body.serviceInfo
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <view v-if="Object.keys(serviceInfo).length > 0" class="w-full">
      <view>
        <swiper
          class="swiper h-220px"
          circular
          indicator-dots="true"
        >
          <swiper-item v-for="item of 4" :key="item">
            <image v-for="item of serviceInfo.resourceList" :key="item" class="w-full h-full mb-1" mode="widthFix" :src="item.resourceUrl" />
          </swiper-item>
        </swiper>
      </view>
      <view>
        <view class="px-2 my-2">
          <view class="bg-white p-2 rounded-md">
            <view>
              <view class="flex items-center">
                <view class="text-sm mr-8 text-gray-500">
                  名称
                </view>
                <view class="text-xs">
                  {{ serviceInfo.name || '暂无' }}
                </view>
                <van-divider />
              </view>
              <view class="flex items-center">
                <view class="text-sm mr-8 text-gray-500">
                  说明
                </view>
                <view class="text-xs">
                  {{ serviceInfo.content || '暂无' }}
                </view>
                <van-divider />
              </view>
              <view class="flex items-center">
                <view class="text-sm mr-8 text-gray-500">
                  标签
                </view>
                <view class="text-xs">
                  {{ serviceInfo.labels || '暂无' }}
                </view>
                <van-divider />
              </view>
              <view class="flex items-center">
                <view class="text-sm mr-8 text-gray-500">
                  价格
                </view>
                <view class="text-xs">
                  {{ `￥${serviceInfo.price}` || '暂无' }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="mb-4">
        <view class="px-2">
          <view class="bg-white p-2 rounded-md">
            <view class="text-sm font-bold py-2">
              服务详情
            </view>
            <view class="flex flex-col">
              <view class="text-xs flex flex-wrap overflow-hidden text-gray-500">
                <rich-text v-if="serviceInfo.detail" :nodes="serviceInfo.detail" />
                <view v-else>
                  暂无
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="px-2 mt-2">
          <view class="bg-white p-2 rounded-md">
            <view class="text-sm font-bold py-2">
              服务备注
            </view>
            <view class="flex flex-col">
              <view class="text-xs flex flex-wrap overflow-hidden text-gray-500">
                <rich-text v-if="serviceInfo.remarks" :nodes="serviceInfo.remarks" />
                <view v-else>
                  暂无
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <van-empty v-else description="暂无数据" />
  </container>
</template>

<style scoped>
</style>
