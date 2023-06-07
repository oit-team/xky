<script>
import LuckItem from '../activity/components/luckItem'
import { addParticipateActivity, getActivityById, getActivityJackpotList } from '@/api/luck'

export default {
  components: {
    LuckItem,
  },
  data: () => ({
    list: [
      {
        title: '详情',
        id: 0,
      },
      {
        title: '奖券',
        id: 1,
      },
      {
        title: '活动订单',
        id: 2,
      },
    ],
    active: 0,
    activityId: '',
    activity: {},
    pms: false,
    jackpotForm: {
      pageSize: 20,
      pageNum: 1,
    },
    jackpotList: [],
    jackpotEmpty: true,
  }),
  onLoad(option) {
    if (option.activityId) {
      this.activityId = option.activityId
      this.getData()
      this.getActivity()
    }
  },
  methods: {
    async getData() {
      this.$toast.loading({ mesage: '加载中' })
      const { body } = await getActivityById({
        activityId: this.activityId,
      }).finally(() => this.$toast.clear())
      this.pms = true
      this.activity = body
    },
    async getActivity() {
      const { body } = await getActivityJackpotList({
        ...this.jackpotForm,
        activityId: this.activityId,
      })
      this.jackpotList = body.resultList
      this.jackpotEmpty = body.count === 0
    },
    onChange(e) {
      this.active = e.detail.name
    },
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
  <container classes="bg-gray-100 text-sm flex flex-col" :class="activity.isParticipate === 0 ? 'pb-20' : ''">
    <view v-if="!pms" class="w-full bg-white flex-1 p-2 box-border">
      <van-skeleton title row="4" class="h-full" />
    </view>
    <view v-if="pms" class="flex-1 w-full">
      <van-tabs color="#6FA7FF" :active="active" sticky @change="onChange">
        <van-tab title="详情" :name="0">
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
            <view class="box-border">
              <view class="py-2">
                活动介绍
              </view>
              <view class="bg-white p-2 rounded-md text-xs">
                <rich-text :nodes="activity.content" />
              </view>
              <view class="py-2">
                活动说明
              </view>
              <view class="bg-white p-2 rounded-md text-xs">
                <rich-text :nodes="activity.remarks" />
              </view>
            </view>
          </view>
        </van-tab>
        <van-tab title="奖券" :name="1">
          <view v-if="jackpotEmpty">
            <van-empty />
          </view>
          <view v-else class="w-full h-full">
            <luck-item :list="jackpotList" />
          </view>
        </van-tab>
        <van-tab title="活动订单" :name="2">
          33
        </van-tab>
      </van-tabs>
    </view>

    <view v-if="activity.isParticipate === 0" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border">
      <van-button color="#f9591d" block round @click.self="join()">
        立即参与
      </van-button>
    </view>
  </container>
</template>

<style lang='scss' scoped>

</style>
