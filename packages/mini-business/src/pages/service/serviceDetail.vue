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
      }).finally(() => this.$toast.clear())
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
          <swiper-item v-for="item of serviceInfo.resourceList" :key="item">
            <image class="w-full h-full mb-1" mode="widthFix" :src="item.resourceUrl" />
          </swiper-item>
        </swiper>
      </view>
      <view>
        <view class="px-2 my-2">
          <view class="bg-white p-2 rounded-md">
            <view class="grid grid-cols-1 gap-2">
              <view class="flex justify-between items-center">
                <view class="text-sm font-600">
                  {{ serviceInfo.name || '暂无' }}
                </view>

                <view class="text-xs text-red-500">
                  <van-tag
                    type="warning"
                    color="#FFE5D4"
                    text-color="#ef4444"
                  >
                    预
                  </van-tag>
                  {{ `￥${serviceInfo.price}` || '暂无' }}
                </view>
              </view>
              <view class="flex items-center">
                <view class="text-xs">
                  <view v-if="serviceInfo.labels">
                    <van-tag
                      v-for="tag of serviceInfo.labels.split(',')"
                      :key="tag"
                      class="mr-2"
                      type="warning"
                      color="#FFE5D4"
                      text-color="#F07623"
                    >
                      {{ tag }}
                    </van-tag>
                  </view>
                  <view v-else>
                    暂无
                  </view>
                </view>
                <!-- <van-divider /> -->
              </view>
              <view class="flex items-center">
                <view class="text-xs">
                  {{ serviceInfo.content || '暂无' }}
                </view>
                <!-- <van-divider /> -->
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="mb-4 px-2">
        <van-tabs>
          <van-tab title="预约详情">
            <view class=" mt-2">
              <view class="bg-white p-2 rounded-md">
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
          </van-tab>
          <van-tab title="预约须知">
            <view class="mt-2">
              <view class="bg-white p-2 rounded-md">
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
          </van-tab>
        </van-tabs>
      </view>
    </view>
    <van-empty v-else description="暂无数据" />
  </container>
</template>

<style scoped>
</style>
