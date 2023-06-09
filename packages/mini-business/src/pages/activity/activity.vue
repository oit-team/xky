<script>
import notLogged from '../../components/business/notLogged/notLogged'
import LuckItem from './components/luckItem'
import Tabs from '@/components/tabs/tabs'
import card from '@/components/business/card/card'
import { getDevState } from '@/api/largeScreen'
import { getDrawProduct, getLuckyDrawRecord } from '@/api/luck'
import { convertImageSize } from '@/utils/helper'

export default {
  components: {
    Tabs,
    Card: card,
    LuckItem,
    NotLogged: notLogged,
  },
  data() {
    return {
      devIndex: 0,
      devList: [],
      luckList: [],
      devId: '',
      winList: [],
      topEmp: true,
      btmEmp: true,
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  watch: {
    devIndex() {
      this.devId = this.devList[this.devIndex].devId
      this.getLuckyDrawRecord()
    },
  },
  onLoad() {
  },
  onShow() {
    if (this.logged) {
      this.getDevState()
      this.getDrawProduct()
    }
  },
  methods: {
    convertImageSize,
    async getDevState() {
      const res = await this.$loading(getDevState())
      this.devList = res.body.resultList
      this.devId = this.devList[this.devIndex]?.devId
      if (this.devList.length > 0)
        this.getLuckyDrawRecord()
    },
    async getDrawProduct() {
      const res = await getDrawProduct({
        pageSize: 8,
        pageNum: 1,
        shopId: this.$store.state.userInfo.shopId,
      })
      this.luckList = [...res.body.result]
      this.btmEmp = this.luckList.length <= 0
    },
    async getLuckyDrawRecord() {
      const res = await this.$loading(getLuckyDrawRecord({
        pageSize: 2,
        pageNum: 1,
        num: 1,
        shopId: this.$store.state.userInfo.shopId,
        deviceId: this.devId,
      }),
      )
      this.$toast.clear()
      this.winList = res.body.result
      this.topEmp = this.winList.length <= 0
    },
    selectTab(index) {
      this.devIndex = index
    },
    toWin() {
      uni.navigateTo({
        url: `/pages/activity/luckList?id=${this.devId}`,
      })
    },
    toLuck() {
      uni.navigateTo({
        url: '/pages/activity/jackpot',
      })
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <view v-if="logged" class="w-full py-2 flex items-center">
      <view
        class="flex text-sm bg-[#3490dc] text-white px-2 py-1 rounded-full mx-1 truncate"
        @click="getDevState(true)"
      >
        <van-icon name="aim" />
        <span class="ml-1">探测</span>
      </view>
      <tabs :list="devList" class="w-full flex-1 overflow-hidden overflow-x-auto mr-1" @select-tab="selectTab()" />
    </view>

    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged />
    </view>

    <view v-else class="continer w-full flex-1 flex flex-col">
      <view class="px-2 my-2" @click="toWin()">
        <card>
          <template #left-title>
            待领奖名单
          </template>
          <template #right-title>
            <view class="flex text-[#34495e]">
              <view>更多抽奖名单</view>
              <van-icon name="arrow" size="14" />
            </view>
          </template>
          <template #content>
            <view v-if="topEmp">
              <van-empty description="暂无数据" class="h-10" />
            </view>
            <view v-else class="w-full pb-3">
              <luck-item :list="winList" />
            </view>
          </template>
        </card>
      </view>

      <view class="px-2 my-2 flex-1 flex" @click="toLuck()">
        <card class="w-full flex-1 rounded-xl bg-white">
          <template #left-title>
            奖池
          </template>
          <template #right-title>
            <view class="flex text-[#34495e]">
              <view>更多</view>
              <van-icon name="arrow" size="14" />
            </view>
          </template>
          <template #content>
            <view v-if="btmEmp" class="h-full">
              <van-empty description="暂无数据" />
            </view>
            <view v-else class="grid grid-cols-4 gap-2 pb-3 px-2">
              <view
                v-for="(item, index) in luckList"
                :key="index"
                class="flex flex-col items-center bg-gray-100 rounded-md pt-1 box-border"
              >
                <van-image
                  width="50"
                  height="50"
                  :src="convertImageSize(item.imgRes[0], 's')"
                  fit="contain"
                  class="overflow-hidden"
                />
                <view class="text-xs text-center my-1 truncate w-full">
                  {{ item.vouchersName }}
                </view>
                <view class="text-xs text-red-500 ">
                  ￥{{ item.jackpotPrice }}
                </view>
              </view>
            </view>
          </template>
        </card>
      </view>
    </view>
  </container>
</template>

<style scoped>
.continer {
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.16);
}
 .continer >>> .van-empty {
    padding: unset;
  }
::v-deep.continer .van-empty__image {
    width: 100px;
    height: 100px;
  }
::v-deep .van-image {
    display: block;
  }
</style>
