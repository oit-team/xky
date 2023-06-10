<script>
import LuckItem from './components/luckItem'
import { getDrawDetailed, getLuckyDrawRecord, updateUserDraw } from '@/api/luck'

const TYPE = {
  CONFIRM: 1,
  WRITEOFF: 2,
  OVER: 3,
}
export default {
  components: {
    LuckItem,
  },
  data() {
    return {
      active: 0,
      winList: [],
      tabList: [],
      cardList: [],
      showEmpty: true,
      showPopup: false,
      formData: {
        pageSize: 15,
        pageNum: 1,
        num: 1,
        shopId: '',
        deviceId: '',
      },
    }
  },
  watch: {
    active() {
      this.formData.num = this.active + 1
      this.getLuckyDrawRecord()
    },
  },
  onLoad(op) {
    this.formData.deviceId = op.id
  },
  onShow() {
    this.getLuckyDrawRecord()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getLuckyDrawRecord()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    async getLuckyDrawRecord() {
      this.formData.shopId = this.$store.state.userInfo.shopId
      const res = await getLuckyDrawRecord({
        ...this.formData,
      })
      this.tabList = res.body.allStateCount
      this.tabList.forEach((e) => {
        if (e.state === TYPE.CONFIRM)
          this.$set(e, 'title', '待确认')
        else if (e.state === TYPE.WRITEOFF)
          this.$set(e, 'title', '待核销')
        else this.$set(e, 'title', '已完成')
      })
      this.winList = res.body.result
      this.showEmpty = this.winList.length === 0
      this.$toast.clear()
    },
    async reload() {
      const res = await getLuckyDrawRecord({
        ...this.formData,
      })
      this.winList = [...this.winList, ...res.body.allStateCount]
      if (res.body.allStateCount.length === 0)
        this.$toast('加载完毕')

      this.$toast.clear()
    },
    async getCard(index) {
      const res = await getDrawDetailed({
        shopId: this.$store.state.userInfo.shopId,
        deviceId: this.formData.deviceId,
        weChatId: index,
        num: this.formData.num,
      })
      this.cardList = res.body.result
      this.cardList.forEach((item) => {
        item.effectiveStart = item.effectiveStart?.replace(/-/g, '/')
        item.effectiveEnd = item.effectiveEnd?.replace(/-/g, '/')
      })
      this.showPopup = true
    },
    onChange(e) {
      this.active = e.detail.index
    },
    show(index) {
      this.getCard(index)
    },
    async luckConfirm(index) {
      await updateUserDraw({
        recordId: index,
        state: 2,
      })
      this.showPopup = false
      await this.getLuckyDrawRecord()
    },
    async luckRefuse(index) {
      await updateUserDraw({
        recordId: index,
        state: 5,
      })
      this.showPopup = false
      await this.getLuckyDrawRecord()
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <!--    抽奖名单 -->
    <view v-if="tabList.length" class="header w-full">
      <van-tabs :active="active" @change="onChange()">
        <van-tab v-for="item in tabList" :key="item.state" :title="`${item.title}(${item.stateNum})`" />
      </van-tabs>
    </view>
    <view class="content w-full mt-2">
      <view v-if="showEmpty">
        <van-empty description="暂无数据" />
      </view>
      <view v-else class="flex flex-col pb-3 px-2 box-border">
        <luck-item :list="winList" @show="show()" />
      </view>
    </view>

    <van-popup
      :show="showPopup"
      position="bottom"
      custom-style="height: 70%;"
      round
      @click-overlay="showPopup = false"
    >
      <view class="w-full py-3 px-2 box-border">
        <view
          v-for="(item, index) in cardList"
          :key="index"
        >
          <view
            class="flex justify-between px-3 py-2 border-1 border-gray-100 border-solid rounded-md mb-2"
          >
            <view class="flex items-center w-full">
              <van-image
                width="60"
                height="60"
                :src="item.imgUrl"
                fit="contain"
                class="mr-2 border-right-dotted bg-neutral-100 rounded-md"
              />
              <view class="w-full">
                <view class="flex w-full justify-between">
                  <view class="w-110px">
                    <view class="text-[#34495e] w-full truncate">
                      {{ item.vouchersName || '暂无' }}
                    </view>
                    <view class="text-xs text-gray-500 w-full truncate">
                      备注：{{ item.jackpotNote || '暂无' }}
                    </view>
                    <view class="text-xs text-gray-500">
                      有效期：
                    </view>
                  </view>

                  <view class="flex justify-end items-center w-120px">
                    <view
                      v-if="active === 0"
                      class="h-full flex justify-around items-center"
                    >
                      <van-button
                        block
                        class="w-full text-sm mr-2"
                        type="info"
                        size="small"
                        round
                        @click="luckConfirm(item.recordId)"
                      >
                        确认
                      </van-button>
                      <van-button
                        block
                        class="w-full text-sm"
                        type="danger"
                        size="small"
                        round
                        @click="luckRefuse(item.recordId)"
                      >
                        拒绝
                      </van-button>
                    </view>
                  </view>
                </view>

                <view>
                  <view v-if="item.effectiveStart || item.effectiveEnd" class="text-xs text-gray-500">
                    {{ item.effectiveStart }}-{{ item.effectiveEnd }}
                  </view>
                  <view v-else class="text-xs text-gray-500 my-2">
                    暂无
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </container>
</template>

<style scoped>
::v-deep .van-image__img {
  border-radius: 8px;
}

::v-deep .van-image {
  display: block;
}

::v-deep .van-button{
  border-right: 8px;
}
</style>
