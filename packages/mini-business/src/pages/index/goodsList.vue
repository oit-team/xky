<script>
import { getStyleList } from '@/api/largeScreen'
import { convertImageSize } from '@/utils/helper'

export default {
  data: () => ({
    classList: [],
    selectClass: 0,
    indexData: [],
    showEmpty: false,
    styleEmpty: false,
    clickConfirm: false,
    formData: {
      pageNum: 1,
      pageSize: 21,
    },
    selectImgs: {},
    show: false, // 弹出层
    showDate: false,
    optionIds: [],
  }),
  computed: {
    total() {
      return Object.keys(this.selectImgs).length
    },
  },
  onLoad(option) {
    this.optionIds = JSON.parse(option.id)
  },
  async onShow() {
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    })
    await this.getData()
    this.$toast.clear()
  },
  onReady() {
  },
  watch: {
    indexData() {
      this.optionIds.forEach((e) => {
        this.indexData.forEach((item) => {
          if (item.styleId === Number(e))
            this.$set(this.selectImgs, Number(e), { ...item })
        })
      })
    },
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
    // 获取商品列表数据
    async getData() {
      this.showEmpty = false

      const res = await getStyleList({
        ...this.formData,
        styleNo: '',
        styleName: '',
      }).finally(() => this.$toast.clear())
      this.indexData = res.body.resultList
      this.showEmpty = res.body.resultList.length === 0
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      const res = await getStyleList({
        ...this.formData,
        styleNo: '',
        styleName: '',
      }).finally(() => this.$toast.clear())
      this.indexData = [...this.indexData, ...res.body.result]
      if (res.body.resultList.length === 0)
        this.$toast('加载完毕')
    },
    addSingle(item) {
      const length = this.total + 1
      if (length > 5)
        return this.$toast('最多只能选择5件商品')
      this.$set(this.selectImgs, item.styleId, {
        ...item,
      })
    },
    // 删除照片
    delSingle(item) {
      this.$delete(this.selectImgs, item.styleId)
    },
    checkSelected(item) {
      return this.selectImgs[item.styleId]
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
      uni.$emit('goods-list', this.selectImgs)
      this.selectImgs = {}
      uni.navigateBack()
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
          <view class="addIcon bg-transparent">
            <van-icon v-if="!checkSelected(item)" size="24" name="add" color="#f43f5e" @click.stop="addSingle(item, index)" />
            <van-icon v-else name="clear" size="24" color="#000000" @click.stop="delSingle(item, index)" />
          </view>
          <van-image
            width="110"
            height="110"
            :src="convertImageSize(item.resUrl, 's')"
            fit="contain"
          />
          <view class="list-info flex flex-col items-center">
            <view class="van-multi-ellipsis--l2 w-full text-center h-6 box-border truncate">
              {{ item.styleName }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!--    底部确认 -->
    <view
      class="page-btm bgf !fixed bottom-0 text-sm flex justify-end w-full items-center px-2 box-border bg-white z-10"
    >
      <view class="mr-2" @click.stop="clickShow()">
        已选中：{{ total }}/5
      </view>
      <van-button class="py-2" size="small" type="info" round @click="onsubmit()">
        确认
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
            v-for="(item, index) of selectImgs"
            :key="item.styleId"
            class="box-border relative flex bg-gray-100 rounded"
          >
            <van-image
              width="110"
              height="110"
              :src="convertImageSize(item.resUrl, 's')"
              fit="contain"
            />
            <view class="pop-item__del" @click="delImg(item, index)">
              <van-icon name="cross" color="#fff" size="14" />
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

.addIcon {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: transparent;
  color: #fff;
  font-size: 26px;
  line-height: 30px;
  text-align: center;
  z-index: 1;
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
</style>
