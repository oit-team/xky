<script>
import dayjs from 'dayjs'
import { addAddActivityJackpot, getJackpotStyleAll } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'
import scrollBtm from '@/components/business/scrollBtm/scrollBtm'

export default {
  components: {
    ScrollBtm: scrollBtm,
  },
  data: () => ({
    classList: [],
    selectClass: 0,
    indexData: [],
    selectList: [],
    showEmpty: false,
    styleEmpty: false,
    clickConfirm: false,
    defaultDate: [dayjs().subtract(6, 'month').toDate(), new Date()], // 默认开始时间为半年前
    minDate: dayjs().subtract(1, 'year').toDate(), // 日历可选当前时间前后一年
    maxDate: dayjs().add(1, 'year').toDate(),
    formData: {
      pageNum: 1,
      pageSize: 20,
      jackpotType: 1,
    },
    selectCards: {},
    show: false, // 弹出层
    showDate: false,
    canReload: true,
    stepper: 1,
    activityId: '',
  }),
  computed: {
    total() {
      return Object.keys(this.selectCards).length
    },
    pastTime() {
      return dayjs().subtract(6, 'month').toDate()
    },
  },
  onLoad(option) {
    if (option.activityId)
      this.activityId = option.activityId
  },
  onShow() {
    this.getData()
  },
  onReady() {
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
    convertImageSize,
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD')
    },

    // 获取商品列表数据
    async getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const { body } = await getJackpotStyleAll({
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.indexData = body.resultList.map((item) => {
        this.$set(item, '_check', false)
        return item
      })
      this.showEmpty = body.count === 0
      this.canReload = body.count > this.formData.pageSize
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      const res = await getJackpotStyleAll({
        ...this.formData,
      }).finally(() => this.$toast.clear())
      this.indexData = [...this.indexData, ...res.body.result]
      this.canReload = this.indexData.length < res.body.count
    },
    addSingle(item) {
      this.$set(this.selectCards, item.jackpotId, {
        ...item,
        stepper: 1,
      })
    },
    // 删除照片
    delSingle(item) {
      this.$delete(this.selectCards, item.jackpotId)
    },
    checkSelected(item) {
      return !!this.selectCards[item.jackpotId]
    },
    // 单独删除图片
    delImg(item) {
      this.$delete(this.selectCards, item)
      if (this.total === 0)
        this.show = false
    },
    clickShow() {
      if (this.total === 0)
        this.$toast('您还未选择奖券')
      else
        this.show = true
    },
    // 点击确认按钮
    onsubmit() {
      if (JSON.stringify(this.selectCards) === '{}') { this.$toast('您还未选择奖券') }

      else {
        this.$dialog.confirm({
          title: '提示',
          message: '确定添加奖券吗？',
        }).then(async () => {
          const list = Object.values(this.selectCards)
          await addAddActivityJackpot({
            jackpotIds: list.map(item => ({
              jackpotId: item.jackpotId,
              jackpotNumber: item.stepper,
            })),
            activityId: this.activityId,
          })

          uni.navigateBack()
        })
      }
    },
    onChange(e, id) {
      if (this.selectCards[id].jackpotInventory < e.detail) {
        this.selectCards[id].stepper = this.selectCards[id].jackpotInventory
        return
      }

      this.selectCards[id].stepper = e.detail
    },
  },
}
</script>

<template>
  <container classes="flex flex-col bg-gray-100">
    <view class="flex-1">
      <van-empty v-if="showEmpty" class="flex-1" description="暂无数据" />
      <!--    列表 -->
      <view v-else class="w-full h-full">
        <view class="w-full pb-10 flex-1 text-sm grid grid-cols-3 gap-3 p-2 box-border">
          <view
            v-for="(item, index) in indexData"
            :key="index"
            class="rounded-md relative bg-white"
          >
            <view class="!absolute -right-1.5 -top-1.5 !text-xs w-18px h-18px rounded-1/2 text-center z-10" :class="[!checkSelected(item) ? 'bg-red-500/50' : 'bg-black']">
              <van-icon
                v-if="!checkSelected(item)"
                name="plus"
                color="#fff"
                @click.stop="addSingle(item)"
              />
              <van-icon
                v-else
                name="minus"
                color="#fff"
                @click.stop="delSingle(item)"
              />
            </view>
            <view v-if="item._check" class="!absolute -left-1 -top-1 z-10">
              <van-icon
                size="20"
                color="#a3e635"
                name="checked"
              />
            </view>
            <van-image
              height="120px"
              :src="item.impUrl"
              class="bg-black"
              fit="contain"
            />
            <view class="list-info flex flex-col items-center p-2 box-border">
              <view class="van-multi-ellipsis--l2 w-full text-center box-border truncate">
                {{ item.vouchersName }}
              </view>
              <view class="w-full text-center box-border text-xs truncate">
                有效期：{{ item.periodValidity }}
              </view>
            </view>
          </view>
        </view>
        <scroll-btm :can-reload="canReload" />
      </view>
    </view>

    <!--    底部确认 -->
    <view
      class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center px-2 box-border bg-white z-10"
    >
      <view class="flex items-center mr-2 flex-1 text-xs text-[#888]">
        <!-- <van-icon
          size="18"
          color="#60a5fa"
          name="passed"
        />
        表示已选图片 -->
      </view>
      <view class="mr-2 text-[#60a5fa]" @click.stop="clickShow()">
        已选：{{ total }}
      </view>
      <van-button class="py-2" size="small" type="info" round @click="onsubmit()">
        确认
      </van-button>
      <!--      </view> -->
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
            v-for="(item, index) of selectCards"
            :key="item.jackpotId"
            class="p-1 box-border relative rounded"
          >
            <view class="pop-item__del" @click="delImg(item, index)">
              <van-icon name="cross" color="#fff" size="14" />
            </view>
            <van-image
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
                @change="($event) => onChange($event, item.jackpotId)"
              />
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </container>
</template>

<style scoped>
.vid-w {
  width: 110px;
  height: 110px;
}

.pop-item__del {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

::v-deep .van-image__img{
  background: #f7f8fa;
}
::v-deep .van-image {
  display: block;
}
</style>
