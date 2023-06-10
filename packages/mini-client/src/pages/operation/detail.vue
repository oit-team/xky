<script>
import { addParticipateActivity, getActivityById } from '@/api/shop'

export default {
  components: {
  },
  data: () => ({
    active: 0,
    activityId: '',
    activity: {},
    pms: false,
    show: false,

  }),
  computed: {
  },
  // async onPullDownRefresh() {
  //   if (this.active === 1) {
  //     this.jackpotForm.pageNum = 1
  //     await this.getActivity()
  //   }
  //   if (this.active === 2) {
  //     this.myJackpotForm.pageNum = 1
  //     await this.getMyActivity()
  //   }
  //   if (this.active === 3) {
  //     this.orderForm.pageNum = 1
  //     await this.getOrder()
  //   }
  //   uni.stopPullDownRefresh()
  // },
  // async onReachBottom() {
  //   if (this.canReload) {
  //     this.jackpotForm.pageNum++
  //     await this.reload()
  //   }
  // },
  onLoad(option) {
    if (option.activityId) {
      this.activityId = option.activityId
      this.getData()
    }
  },
  methods: {
    // 活动详情
    async getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.$toast.loading({ mesage: '加载中' })
      const { body } = await getActivityById({
        activityId: this.activityId,
      }).finally(() => this.$toast.clear())
      this.pms = true
      this.activity = body
    },
    // 参加活动
    join() {
      this.$dialog.confirm({
        title: '提示',
        message: '确认参与该活动吗',
      }).then(async () => {
        await addParticipateActivity({
          activityId: this.activityId,
        }).finally(() => this.$toast.clear())
        this.$toast.success('成功')
        uni.navigateBack()
      })
    },
  },
}
</script>

<template>
  <container :classes="[activity.isParticipate === 0 && activity.activityStatusKey === 1 ? 'pb-14' : '', 'bg-gray-100 text-sm flex flex-col']">
    <view v-if="!pms" class="w-full bg-white flex-1 pt-4 box-border">
      <van-skeleton title row="3" class="h-full" />
    </view>
    <view v-if="pms" class="flex-1 w-full">
      <view class="p-2">
        <view class="w-full bg-white p-2 box-border rounded-md">
          <swiper indicator-dots circular class="h-200px">
            <swiper-item v-for="(item, index) in activity.activityImgs" :key="index">
              <image :src="item.thumbUrl" class="w-full h-full" mode="aspectFit" />
            </swiper-item>
          </swiper>
          <van-divider custom-style="{margin-top: 2px; margin-bottom: 2px;}" />
          <view class="text-base font-600">
            {{ activity.activityName || '' }}
          </view>
          <view class="text-xs">
            {{ activity.startDateTime }} 至 {{ activity.endDateTime }}
          </view>
        </view>
        <view class="mt-2">
          <van-tabs>
            <van-tab title="活动介绍">
              <view class="mt-2">
                <view class="bg-white p-2 rounded-md">
                  <view class="flex flex-col">
                    <view class="text-xs flex flex-wrap overflow-hidden text-gray-500">
                      <rich-text v-if="activity.content" :nodes="activity.content" />
                      <view v-else>
                        暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </van-tab>
            <van-tab title="活动须知">
              <view class="mt-2">
                <view class="bg-white p-2 rounded-md">
                  <view class="flex flex-col">
                    <view class="text-xs flex flex-wrap overflow-hidden text-gray-500">
                      <rich-text v-if="activity.remarks" :nodes="activity.remarks" />
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
    </view>

    <!-- <view v-if="activity.activityStatusKey === 1 && activity.isParticipate === 0" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border z-20">
      <van-button color="#f9591d" block round @click.self="join()">
        立即参与
      </van-button>
    </view> -->

    <!-- <van-popup
      :show="show"
      round
      position="bottom"
      class="overflow-hidden pt-3 box-border max-h-7/10"
      @click-overlay="show = false"
    >
      <view class="overflow-y-auto h-full">
        <view class="grid grid-cols-3 gap-3 p-3">
          <view
            v-for="item of selectCards"
            :key="item.jackpotId"
            class="p-1 box-border relative rounded"
          >
            <view class="pop-item__del" @click="delSingle(item)">
              <van-icon name="cross" color="#fff" size="14" />
            </view>
            <van-image
              width="110px"
              height="110px"
              :src="item.impUrl"
              fit="contain"
            />
            <view class="w-full flex justify-center">
              <van-stepper
                :value="item.stepper"
                integer
                min="1"
                :max="item.jackpotInventory"
                input-width="45px"
                button-size="25px"
                @change="($event) => stepperChange($event, item.jackpotId)"
              />
            </view>
          </view>
        </view>
      </view>
    </van-popup> -->
  </container>
</template>

<style lang='scss' scoped>
::v-deep van-image{
  display: block;
}
.pop-item__del {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}
</style>
