<script>
import cardItem from './components/cardItem.vue'
import { addActivityOrder, addParticipateActivity, getActivityById, getActivityJackpotList, getActivityOrderList, getUserOpenId, wxPay } from '@/api/luck'
import { unwrapPromise, wxPayment } from '@/utils/helper'

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

    orderForm: {
      pageSize: 20,
      pageNum: 1,
    },
    orderList: [],
    orderEmpty: true,
    canReloadOrder: true,
    payType: 2,
    showLog: false,
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
    if (this.active === 3) {
      this.orderForm.pageNum = 1
      await this.getOrder()
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
    if (this.active === 3 && this.canReloadOrder) {
      this.orderForm.pageNum++
      await this.reloadOrder()
    }
  },
  onLoad(option) {
    if (option.activityId) {
      this.activityId = option.activityId
      this.getData()
      this.getMyActivity()
      this.getActivity()
      this.getOrder()
    }
  },
  methods: {
    wxPayment,
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
        shopActivityCode: 1,
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
        shopActivityCode: 1,
      })
      this.myJackpotList = [...this.myJackpotList, ...body.resultList]
      this.canReloadMy = body.count > this.myJackpotList.length
    },
    // 购买订单列表
    async getOrder() {
      const { body } = await getActivityOrderList({
        ...this.orderForm,
        activityId: this.activityId,
      })
      this.orderList = body.resultList
      this.orderEmpty = body.count === 0
      this.canReloadOrder = body.count > this.orderForm.pageSize
    },
    async reloadOrder() {
      const { body } = await getActivityOrderList({
        ...this.orderForm,
        activityId: this.activityId,
      })
      this.orderList = [...this.orderList, ...body.resultList]
      this.canReloadOrder = body.count > this.orderList.length
    },
    // 顶部tab
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
    toList() {
      uni.navigateTo({
        url: `/pages/operation/cardList?activityId=${this.activityId}`,
      })
    },
    toInfo(id) {
      uni.navigateTo({
        url: `/pages/operation/orderInfo?id=${id}`,
      })
    },
    // 删除选中奖券
    delSingle(item) {
      this.$delete(this.selectCards, item)
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
    // 活动奖池下单
    async onsubmit() {
      if (this.total === 0)
        return this.$toast.fail('您还未选择奖券')
      // await this.$dialog.confirm({
      //   title: '提示',
      //   message: '确定购买吗？',
      // })
      const list = Object.values(this.selectCards)
      await this.$store.dispatch('getOpenId')

      const { body } = await addActivityOrder({
        jackpots: list.map(item => ({
          jackpotId: item.jackpotId,
          jackpotNumber: item.stepper,
        })),
        payType: this.payType, // 支付方式
        orderTotalPrice: this.totalPrice,
        activityId: this.activityId,
        openId: this.$store.state.openId,
      })

      const pay = await wxPay({
        orderNo: body.orderNo,
        stylePrice: body.stylePrice,
        notifyUrl: body.notifyUrl,
        openId: this.$store.state.openId,
        accountType: body.accountType,
      })
      await this.wxPayment({
        nonceStr: pay.body.nonceStr,
        prepayid: pay.body.prepayId,
        timeStamp: pay.body.timeStamp,
        paySign: pay.body.sign,
      })
      this.$toast.success('成功')
      this.total = 0
      this.selectCards = {}
      this.getActivity()
    },
    payTypeChange(e) {
      this.payType = $event.detail
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
        </van-tab>
        <van-tab title="活动奖池" :name="1">
          <view class="w-full h-full relative">
            <view v-if="jackpotEmpty">
              <van-empty />
            </view>
            <view v-else class="w-full h-full relative p-2 pb-14 box-border">
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
                  <view v-if="activity.isParticipate === 1 && activity.isParticipate === 1 && !checkSelected(item)">
                    <van-button color="#f9591d" size="mini" round @click="() => addArray(item)">
                      购买
                    </van-button>
                  </view>
                </card-item>
              </view>
            </view>

            <view
              v-if="activity.isParticipate"
              class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center px-2 box-border bg-white z-10"
            >
              <view class="mr-2 text-[#60a5fa]" @click.stop="clickShow()">
                <span class="mr-2">已选：{{ total }}</span>
                <span v-if="total > 0">总价：￥{{ totalPrice }}</span>
              </view>
              <van-button class="py-2" size="small" type="info" round @click="showLog = true">
                确认购买
              </van-button>
            </view>
          </view>
        </van-tab>
        <van-tab title="我的奖池" :name="2">
          <view class="w-full h-full relative">
            <view v-if="myJackpotEmpty">
              <van-empty />
            </view>
            <view v-else class="w-full h-full relative p-2 pb-14 box-border">
              <view
                v-for="(item, index) in myJackpotList"
                :key="index.jackpotId"
                class="bg-white rounded-md mt-2 box-border"
              >
                <card-item :item="item" />
              </view>
            </view>

            <view v-if="activity.activityStatusKey === 1 && activity.isParticipate === 1" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border">
              <van-button color="#f9591d" block round @click.self="toList()">
                添加奖券
              </van-button>
            </view>
          </view>
        </van-tab>
        <van-tab title="购买记录" :name="3">
          <view class="w-full h-full relative">
            <view v-if="orderEmpty">
              <van-empty />
            </view>
            <view v-else class="p-2 box-border">
              <view v-for="item in orderList" :key="item.activityOrderId" class="bg-white rounded-md p-2 box-border mb-2" @click="toInfo(item.activityOrderId)">
                <view class="flex justify-between">
                  <view>{{ item.activityOrderNo }}</view>
                  <van-tag type="primary">
                    {{ item.orderStatus }}
                  </van-tag>
                </view>
                <view class="flex justify-between items-center">
                  <van-image
                    :src="item.jackpotImg"
                    width="60"
                    height="60"
                  />

                  <view class="flex justify-between mt-2">
                    <view class="ml-4">
                      ×{{ item.totalNumber }}
                    </view>
                  </view>
                </view>
                <view class="flex justify-between text-[#888] text-xs">
                  <view class="text-sm">
                    {{ item.orderCreateTime }}
                  </view>
                  <view class="text-[#ff0000]">
                    ￥<span class="text-sm">{{ item.amount }}</span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </van-tab>
      </van-tabs>
    </view>

    <view v-if="activity.activityStatusKey === 1 && activity.isParticipate === 0" class="mt-2 fixed bottom-0 left-0 w-full p-2 box-border z-20">
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
        <view class="grid grid-cols-1 gap-2 p-2 box-border">
          <view
            v-for="item of selectCards"
            :key="item.jackpotId"
            class="box-border relative rounded"
          >
            <view class="pop-item__del" @click="delSingle(item)">
              <van-icon name="cross" color="#fff" size="14" />
            </view>
            <card-item :item="item">
              <template #price>
                <view>
                  ￥{{ item.jackpotBuyPrice || '0' }}
                </view>
              </template>
              <view class="w-full flex justify-center">
                <van-stepper
                  :value="item.stepper"
                  integer
                  min="1"
                  :max="item.jackpotInventory"
                  button-size="30px"
                  @change="($event) => stepperChange($event, item.jackpotId)"
                />
              </view>
            </card-item>
            <!--
            <van-image
              width="110px"
              height="110px"
              :src="item.impUrl"
              fit="contain"
            /> -->
          </view>
        </view>
      </view>
    </van-popup>

    <van-dialog
      title="提示"
      :show="showLog"
      use-slot
      show-cancel-button
      @confirm="onsubmit()"
      @close="showLog = false"
    >
      <view class="w-full p-4 box-border text-sm">
        <view class="mb-2">
          请选择支付方式
        </view>
        <van-radio-group :value="payType" class="ml-2" @change="payType = $event.detail">
          <van-radio :name="2" custom-class="margin-bottom: 2px; margin-left: 2px;">
            积分支付
          </van-radio>
          <view class="h-2" />
          <van-radio :name="3" custom-class="margin-bottom: 2px; margin-left: 2px;">
            微信支付
          </van-radio>
        </van-radio-group>
      </view>
    </van-dialog>
  </container>
</template>

<style lang='scss' scoped>
::v-deep van-image{
  display: block;
}
.pop-item__del {
  position: absolute;
  top: 8px;
  left: 2px;
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
