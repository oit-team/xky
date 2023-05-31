<script>
import { getProductListById } from '../../api/luck'
import TimerTab from '../../components/tabs/timerTab'
export default {
  components: {
    TimerTab,
  },

  props: {
  },

  data: () => ({
    drag: false,
    iStatusBarHeight: 0,
    topHeight: 0,
    showPop: false,
    indexList: [],
    show: false,
    selectItem: {},
    formData: {
      pageSize: 20,
      pageNum: 1,
      selectTime: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      phone: '',
    },
    showEmpty: false,
    minDate: new Date(2020, 0, 1).getTime(),
    maxDate: new Date().getTime(),
  }),
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  watch: {
    selectItem() {
      this.showPop = true
    },
  },
  onLoad() {
    this.iStatusBarHeight = uni.getMenuButtonBoundingClientRect().top
    this.topHeight = uni.getMenuButtonBoundingClientRect().height
  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.timeTab.getData()
    })
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
      })
      const res = await getProductListById({
        ...this.formData,
      })
      this.indexList = res.body.result
      this.showEmpty = this.indexList.length === 0
      this.$toast('加载成功')
    },
    async reload() {
      const res = await getProductListById({
        ...this.formData,
      })
      if (res.body.result.length === 0) {
        this.$toast('加载完毕')
        return false
      }
      this.indexList = [...this.indexList, ...res.body.result]
    },
    changeDate(item) {
      this.formData.selectTime = item
      this.getData()
    },
    formatDate(date) {
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    onConfirm(e) {
      this.show = false
      const time = this.formatDate(e.detail)
      this.$refs.timeTab.changeToday(e.detail)
      this.formData.selectTime = time
      this.getData()
    },
    search(value) {
      this.formData.phone = value.detail
      this.getData()
    },
    clearPhone() {
      this.formData.phone = ''
      this.getData()
    },
  },
}
</script>

<template>
  <container classes="bg-gray-100 flex flex-col w-full text-sm">
    <!--    <view class="navHeight" :style="{ height: `${iStatusBarHeight}px` }"></view> -->
    <!--    <view class="w-full flex justify-between items-center px-1" :style="{ height: `${topHeight}px` }"> -->
    <!--      <view class="px-2 py-1 box-border"> -->
    <!--        <van-icon -->
    <!--          name="arrow-left" -->
    <!--          size="16" -->
    <!--        ></van-icon> -->
    <!--      </view> -->
    <!--      <view class="width-1-3 py-1"> -->
    <!--        <van-field -->
    <!--          :value="phone" -->
    <!--          placeholder="请输入用户名" -->
    <!--          @change="onChange()" -->
    <!--        /> -->
    <!--      </view> -->
    <!--      <view></view> -->
    <!--    </view> -->
    <view class="w-full mb-2 bg-white shadow-gray-500 shadow-gray-300 shadow-md">
      <timer-tab ref="timeTab" @changeData="changeDate()" @showCalendar="show = true" />
    </view>

    <view class="w-full py-2 px-4 box-border rounded-full">
      <van-field
        :value="formData.phone"
        placeholder="请输入顾客手机号"
        clearable
        @confirm="search()"
        @clear="clearPhone()"
      />
    </view>

    <view v-if="showEmpty" class="flex-1 z-10">
      <van-empty description="暂无数据" />
    </view>
    <view v-else class="gap-3 flex-1 px-2 w-full box-border">
      <view
        v-for="(item, index) in indexList"
        :key="index"
        class="w-full p-2 box-border rounded-md bg-white flex items-center mb-2"
        @click="selectItem = item"
      >
        <van-image
          width="60"
          height="60"
          class="rounded-md overflow-hidden"
          :src="item.styles[0].resUrl"
        />
        <view class="flex-1 pl-2 flex flex-col gap-1">
          <text>关联手机号：{{ item.phone }}</text>
          <text>
            {{ item.styles[0].createTime }}
          </text>
        </view>
        <view class="px-2 flex justify-center items-center">
          ×{{ item.styles.length }}
        </view>
      </view>
    </view>

    <van-popup
      :show="showPop"
      round
      position="bottom"
      custom-style="height: 70%;"
      @close="showPop = false"
    >
      <view class="text-center text-base pt-2" @click="uni.makePhoneCall({ phoneNumber: selectItem.phone })">
        <!--        <van-icon name="phone" color="#0ea5e9"></van-icon> -->
        <van-button icon="phone" round size="small" type="primary">
          {{ selectItem.phone }}
        </van-button>
      </view>
      <view class="w-full p-2 box-border grid grid-cols-3 gap-2">
        <view
          v-for="(item, index) in selectItem.styles"
          :key="index"
          class="rounded-md overflow-hidden border-1 border-gray-100 border-solid flex flex-col items-center p-2 box-border"
        >
          <van-image
            width="70"
            height="70"
            class="rounded-md overflow-hidden"
            :src="item.resUrl"
          />
          <view class="text-center text-xs w-full box-border">
            <view class="text-[#fa564f]">
              ￥{{ item.productPrice }}
            </view>
            <view class="truncate">
              {{ item.productNo }}
            </view>
            <view class="truncate">
              {{ item.productName }}
            </view>
          </view>
        </view>
      </view>
    </van-popup>

    <van-calendar
      :show="show"
      :show-confirm="false"
      :min-date="minDate"
      :max-date="maxDate"
      color="#6FA7FF"
      @close="show = false"
      @confirm="onConfirm()"
    />
  </container>
</template>

<style scoped>
::v-deep .van-image{
  display: block;
}
::v-deep .van-cell{
  border-radius: 99px;
}
/*.whiteSpace{*/
/*  display: -webkit-box;*/
/*  -webkit-box-orient: vertical;*/
/*  -webkit-line-clamp: 2;*/
/*  overflow: hidden;*/
/*}*/
</style>
