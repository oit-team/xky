<script>
import notLogged from '../../components/business/notLogged/notLogged'
import { addParticipateActivity, getActivityList } from '@/api/luck'

export default {
  name: 'operation',
  components: {
    NotLogged: notLogged,
  },
  data: () => ({
    list: [
      {
        title: '未参与',
        id: 0,
      },
      {
        title: '已参与',
        id: 1,
      },
      {
        title: '已结束',
        id: 2,
      },
    ],
    active: 0,
    formData: {
      pageSize: 20,
      pageNum: 1,
      activityName: '',
      shopActivityType: 0,
    },
    activityList: [],
    canReload: true,
    isEmpty: true,
  }),
  computed: {
    logged() {
      return this.$store.getters.logged
    },
    activityName() {
      return this.formData.activityName
    },
  },
  async onShow() {
    await this.$store.state.userPromise

    this.getData()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
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
      }).finally(() => this.$toast.clear())
      this.activityList = [...this.activityList, ...body.resultList]
      this.canReload = body.count > this.activityList.length
    },
    onChange(e) {
      this.active = e.detail.name
      this.isEmpty = true
      this.formData.shopActivityType = this.active
      this.getData()
    },
    async onSearch(e) {
      this.formData.activityName = e.detail
      await this.getData()
    },
    async onClear() {
      this.formData.activityName = ''
      await this.getData()
    },
    toDetail(id) {
      uni.navigateTo({
        url: `/pages/operation/detail?activityId=${id}`,
      })
    },
    async join(id) {
      this.$dialog.confirm({
        title: '提示',
        message: '确认参与该活动吗',
      }).then(async () => {
        await addParticipateActivity({
          activityId: id,
        })
        this.$toast.success('成功')
        setTimeout(() => {
          this.$toast.clear()
          this.getData()
        }, 500)
      })
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100 text-sm">
    <view v-if="logged" class="w-full">
      <view>
        <view class="mb-2">
          <van-search :value="activityName" placeholder="请输入活动名称" @search="onSearch" @clear="onClear" />
        </view>
        <van-tabs color="#6FA7FF" :active="active" @change="onChange">
          <van-tab v-for="item in list" :key="item.id" :title="item.title" :name="item.id" />
        </van-tabs>
      </view>

      <van-empty v-if="isEmpty" :description="active === 0 ? '暂未发布活动' : '暂未参加活动'" />
      <view v-else class="w-full p-2 pt-0 box-border">
        <view v-for="(item, index) in activityList" :key="index" class="mt-2 bg-white rounded-md p-2 box-border flex" @click="toDetail(item.activityId)">
          <view class="">
            <van-image width="60px" height="60px" :src="item.activityImg" class="rounded-md mr-2" />
          </view>
          <!-- flex flex-col justify-between -->
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
      </view>
    </view>
    <view v-else class="flex-1 rounded-xl w-full">
      <not-logged />
    </view>
  </container>
</template>

<style scoped>
::v-deep van-image{
  display: flex;
}
</style>
