<script>
import cardItem from './components/cardItem.vue'
import { addActivityOrder, addParticipateActivity, getActivityById, getActivityJackpotList } from '@/api/luck'

export default {
  components: {
    CardItem: cardItem,
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
    myJackpotForm: {
      pageSize: 20,
      pageNum: 1,
    },
    myJackpotList: [],
    myJackpotEmpty: true,
    jackpotForm: {
      pageSize: 20,
      pageNum: 1,
      jackpotType: 0,
    },
    jackpotList: [],
    jackpotEmpty: true,
    canReloadMy: true,
    canReload: true,
    jackpotArray: {},
    selectCards: {},
    show: false,
  }),
  computed: {
    total() {
      return Object.keys(this.selectCards).length
    },
    totalPrice() {
      return Object.values(this.selectCards).reduce((num, item) => {
        return num + (item.stepper * Number.parseFloat(item.jackpotBuyPrice).toFixed(2))
      }, 0)
    },
  },
  async onPullDownRefresh() {
    if (this.active === 1) {
      this.jackpotForm.pageNum = 1
      await this.getActivity()
    }
    if (this.active === 2) {
      this.myJackpotForm.pageNum = 1
      await this.getMyActivity()
    }
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (this.active === 1 && this.canReload) {
      this.jackpotForm.pageNum++
      await this.reload()
    }
    if (this.active === 2 && this.canReloadMy) {
      this.myJackpotForm.pageNum++
      await this.reloadMy()
    }
  },
  onLoad(option) {
    if (option.activityId) {
      this.activityId = option.activityId
      this.getData()
      this.getMyActivity()
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
    // 活动奖券列表
    async getActivity() {
      const { body } = await getActivityJackpotList({
        ...this.jackpotForm,
        activityId: this.activityId,
      })
      this.jackpotList = body.resultList.map(item => ({
        ...item,
        stepper: 0,
      }))
      this.jackpotEmpty = body.count === 0
      this.canReload = body.count > this.jackpotForm.pageSize
    },
    async reload() {
      const { body } = await getActivityJackpotList({
        ...this.jackpotForm,
        activityId: this.activityId,
      })
      this.jackpotList = [...this.jackpotList, ...body.resultList]
      this.canReload = body.count > this.jackpotList.length
    },
    // 商家活动奖券列表
    async getMyActivity() {
      const { body } = await getActivityJackpotList({
        ...this.myJackpotForm,
        activityId: this.activityId,
        shopId: this.$store.state.userInfo.shopId,
      })
      this.myJackpotList = body.resultList
      this.myJackpotEmpty = body.count === 0
      this.canReloadMy = body.count > this.myJackpotForm.pageSize
    },
    async reloadMy() {
      const { body } = await getActivityJackpotList({
        ...this.myJackpotForm,
        activityId: this.activityId,
        shopId: this.$store.state.userInfo.shopId,
      })
      this.myJackpotList = [...this.myJackpotList, ...body.resultList]
      this.canReloadMy = body.count > this.myJackpotList.length
    },
    onChange(e) {
      this.active = e.detail.name
    },
    stepperChange(e, id) {
      if (this.selectCards[id].jackpotInventory < e.detail) {
        this.selectCards[id].stepper = this.selectCards[id].jackpotInventory
        return
      }

      this.selectCards[id].stepper = e.detail
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
    toList() {
      uni.navigateTo({
        // url: '/pages/operation/cardList',
        url: `/pages/operation/cardList?activityId=${this.activityId}`,
      })
    },
    // 删除选中奖券
    delSingle(item) {
      this.$delete(this.selectCards, item.jackpotId)
    },
    checkSelected(item) {
      return !!this.selectCards[item.jackpotId]
    },
    // 选择奖券
    addArray(item) {
      item.stepper = 1
      this.$set(this.selectCards, item.jackpotId, item)
    },
    clickShow() {
      if (this.total === 0)
        this.$toast('您还未选择奖券')
      else
        this.show = true
    },
    onsubmit() {
      if (this.total === 0)
        return this.$toast.fail('您还未选择奖券')
      this.$dialog.confirm({
        title: '提示',
        message: '确定添加奖券吗？',
      }).then(async () => {
        const list = Object.values(this.selectCards)
        await addActivityOrder({
          jackpots: list.map(item => ({
            jackpotId: item.jackpotId,
            jackpotNumber: item.stepper,
          })),
          payType: 2, // 支付方式
          orderTotalPrice: this.totalPrice,
        })
        this.$toast.success('成功')
        this.total = 0
        this.selectCards = {}
        this.getActivity()
      })
    },
  },
}
</script>

<template>
  <container :classes="[activity.activityType !== 1 ? 'pb-14' : '', 'bg-gray-100 text-sm flex flex-col']">
    <view v-if="!pms" class="w-full bg-white flex-1 pt-4 box-border">
      <van-skeleton title row="3" class="h-full" />
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
        <van-tab title="活动奖券" :name="1">
          <view class="w-full h-full relative">
            <view v-if="myJackpotEmpty">
              <van-empty />
            </view>
            <view v-else class="w-full h-full relative p-2 box-border">
              <view
                v-for="(item, index) in jackpotList"
                :key="index.jackpotId"
                class="bg-white rounded-md mt-2 box-border"
              >
                <card-item :item="item">
                  <template #price>
                    <view>
                      ￥{{ item.jackpotBuyPrice || '0' }}
                    </view>
                  </template>
                  <view v-if="activity.activityType === 1 && !checkSelected(item)">
                    <van-button color="#f9591d" size="mini" round @click="() => addArray(item)">
                      购买
                    </van-button>
                  </view>
                </card-item>
              </view>
            </view>

            <view
              v-if="activity.activityType === 1"
              class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center px-2 box-border bg-white z-10"
            >
              <view class="mr-2 text-[#60a5fa]" @click.stop="clickShow()">
                <span class="mr-2">已选：{{ total }}</span>
                <span v-if="total > 0">总价：￥{{ totalPrice }}</span>
              </view>
              <van-button class="py-2" size="small" type="info" round @click="onsubmit()">
                确认购买
              </van-button>
            </view>
          </view>
        </van-tab>
        <van-tab title="商家奖券" :name="2">
          <view class="w-full h-full relative">
            <view v-if="myJackpotEmpty">
              <van-empty />
            </view>
            <view v-else class="w-full h-full relative p-2 box-border">
              <view
                v-for="(item, index) in myJackpotList"
                :key="index.jackpotId"
                class="bg-white rounded-md mt-2 box-border"
              >
                <card-item :item="item" />
              </view>
            </view>

            <view v-if="activity.activityType === 1" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border">
              <van-button color="#f9591d" block round @click.self="toList()">
                添加奖券
              </van-button>
            </view>
          </view>
        </van-tab>
        <van-tab title="活动订单" :name="3">
          444
        </van-tab>
      </van-tabs>
    </view>

    <view v-if="activity.activityType === 0" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border z-20">
      <van-button color="#f9591d" block round @click.self="join()">
        立即参与
      </van-button>
    </view>

    <!--    弹出层 -->
    <van-popup
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
    </van-popup>
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
