<script>
import dayjs from 'dayjs'
import { getAdvertsRes } from '@/api/largeScreen'
import { SELECT_COLLOCATION } from '@/utils/constant'
import { convertImageSize } from '@/utils/helper'

export default {
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
      pageSize: 21,
    },
    selectImgs: {},
    show: false, // 弹出层
    showDate: false,
    canReload: true,
  }),
  computed: {
    total() {
      return Object.keys(this.selectImgs).length
    },
    pastTime() {
      return dayjs().subtract(6, 'month').toDate()
    },
  },
  onLoad(option) {
    this.selectList = JSON.parse(option.list)
  },
  onShow() {
    this.getData()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (!this.canReload)
      return
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD')
    },
    convertImageSize,
    // 获取商品列表数据
    async getData() {
      this.showEmpty = false
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      const res = await getAdvertsRes({
        ...this.formData,
      }).finally(() => this.$toast.clear())

      this.indexData = res.body.result
      this.showEmpty = res.body.count === 0
      this.canReload = res.body.count < this.formData.pageSize
      // let list = []
      this.indexData.forEach((e, i) => {
        this.selectList.forEach((item) => {
          if (e.id === Number(item))
            this.$set(this.indexData[i], '_check', true)
        })
      })
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      const res = await getAdvertsRes({
        ...this.formData,
      }).finally(() => this.$toast.clear())

      this.indexData = [...this.indexData, ...res.body.result]
      this.canReload = res.body.count > this.indexData.length
    },
    addSingle(item) {
      const length = this.total + 1
      if (length > 15)
        return this.$toast('最多只能选择15张图片')
      this.$set(this.selectImgs, item.id, {
        ...item,
      })
    },
    // 删除照片
    delSingle(item) {
      this.$delete(this.selectImgs, item.id)
    },
    checkSelected(item) {
      return this.selectImgs[item.id]
    },
    // 单独删除图片
    delImg(item) {
      this.$delete(this.selectImgs, item)
      if (this.total === 0)
        this.show = false
    },
    clickShow() {
      if (this.total === 0)
        this.$toast('您还未选择搭配单品')
      else
        this.show = true
    },
    // 点击确认按钮
    onsubmit() {
      if (JSON.stringify(this.selectImgs) === '{}') {
        this.$toast('您还未选择搭配单品')
      }
      else {
        uni.$emit(SELECT_COLLOCATION, this.selectImgs)
        this.selectImgs = {}
        uni.navigateBack()
      }
    },
  },
}
</script>

<template>
  <container classes="flex flex-col bg-gray-100">
    <view class="flex-1">
      <van-empty v-if="showEmpty" class="flex-1" description="暂无数据" />
      <!--    列表 -->
      <view v-else class="w-full pb-10 flex-1 text-sm grid grid-cols-3 gap-3 p-2 box-border">
        <view
          v-for="(item, index) in indexData"
          :key="index"
          class="rounded-md relative bg-white"
        >
          <view class="!absolute -right-1.5 -top-1.5 !text-xs w-18px h-18px rounded-1/2 text-center z-10" :class="!checkSelected(item) ? 'bg-[#f43f5e]' : 'bg-black'">
            <van-icon
              v-if="!checkSelected(item)"
              name="plus"
              color="#fff"
              @click.stop="addSingle(item, index)"
            />
            <van-icon
              v-else
              name="minus"
              color="#fff"
              @click.stop="delSingle(item, index)"
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
            v-if="item.resType === 0"
            height="120px"
            :src="convertImageSize(item.resUrl, 's')"
            fit="contain"
          />
          <video
            v-else
            class="vid-w"
            :src="item.videoImg"
            controls
            controlslist="nodownload"
          />
          <view class="list-info flex flex-col items-center">
            <view class="van-multi-ellipsis--l2 w-full text-center h-10 box-border truncate">
              {{ item.resName }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--    底部确认 -->
    <view
      class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center px-2 box-border bg-white z-10"
    >
      <!--      <view class="w-1/2 flex items-center"> -->
      <view class="flex items-center mr-2 flex-1 text-xs text-[#888]">
        <van-icon
          size="18"
          color="#60a5fa"
          name="passed"
        />
        表示已选图片
      </view>
      <view class="mr-2" @click.stop="clickShow()">
        已选中：{{ total }}/15
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
            v-for="(item, index) of selectImgs"
            :key="item.id"
            class="box-border relative flex bg-gray-100 rounded"
          >
            <view class="pop-item__del" @click="delImg(item, index)">
              <van-icon name="cross" color="#fff" size="14" />
            </view>
            <van-image
              v-if="item.resType === 0"
              width="110"
              height="110"
              :src="convertImageSize(item.resUrl, 's')"
              fit="contain"
            />
            <video
              v-else
              class="vid-w"
              :src="src"
              controls
              controlslist="nodownload"
            />
            <view />
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
}

::v-deep .van-image {
  display: block
}
</style>
