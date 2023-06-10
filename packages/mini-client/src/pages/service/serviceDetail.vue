<script>
import { getServiceInfoDetail } from '@/api/shop'
export default {
  components: {
  },
  data() {
    return {
      serviceInfo: {},
      id: '',
      show: false,
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
    upPopup() {
      this.show = true
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <view v-if="Object.keys(serviceInfo).length > 0" class="w-full flex flex-col flex-1">
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
                    暂无标签
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
      <view class="mb-4 px-2 flex-1">
        <van-tabs>
          <van-tab title="预约详情">
            <view class=" mt-2">
              <view class="bg-white p-2 rounded-md">
                <view class="flex flex-col">
                  <view class="text-xs flex flex-wrap overflow-hidden min-h-30 text-gray-500">
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
      <view class="flex justify-between items-center fixed bottom-0 left-0 w-full bg-light-300 p-2 box-border">
        <view class="text-red-500 text-base font-600">
          <span class="text-xs">￥</span>{{ serviceInfo.price }}
        </view>
        <view class="flex items-center">
          <view class="flex flex-col items-center mx-2">
            <van-icon name="chat-o" size="16" />
            <view class="text-xs text-[#888]">
              咨询
            </view>
          </view>
          <van-button type="info" color="#f9591d" round size="small" @click="upPopup">
            立即预约
          </van-button>
        </view>
      </view>
    </view>
    <van-empty v-else description="暂无数据" />

    <van-popup
      :show="show"
      position="bottom"
      custom-style="height: 50%;"
      round
      @close="show = false"
    >
      555
    </van-popup>
  </container>
</template>

<style scoped>
</style>
