<script>
import dayjs from 'dayjs'
import { addPrizeExchangeRecord } from '../../api/luck'
import notLogged from '../../components/business/notLogged/notLogged'
import { parseURLQueryParams } from '../../utils/helper'

export default {
  components: {
    NotLogged: notLogged,
  },
  data() {
    return {
      countDown: 8,
      opt: '',
      timer: null,
      isSuccess: false,
      cardInfo: {},
      nowTime: dayjs().format('YYYY/MM/DD HH:mm:ss'),
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  async onLoad(op) {
    if (this.logged) {
      this.opt = parseURLQueryParams(decodeURIComponent(op.q))
      await this.$store.state.userPromise
      this.getData()
    }
    else {
      uni.setStorageSync('op-confrim', op)
    }
  },
  onShow() {
    if (this.logged) {
      this.timer = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          this.back()
          clearInterval(this.timer)
        }
      }, 1000)
    }
  },
  onHide() {
    clearInterval(this.timer)
  },
  methods: {
    async getData() {
      const res = await addPrizeExchangeRecord({ content: this.opt })
      if (res.head.status !== 0) {
        this.isSuccess = false
        clearInterval(this.timer)
      }
      else {
        this.isSuccess = true
        this.cardInfo = res.body
        this.$toast.success('核销成功')
      }
    },
    back() {
      clearInterval(this.timer)
      uni.switchTab({
        url: '/pages/dataBoard/index',
      })
    },
  },
}
</script>

<template>
  <container classes="h-full w-full flex flex-col items-center bg-gray-100">
    <view v-if="logged" class="flex flex-col items-center px-2 mt-12">
      <view class="mb-4 text-lg">
        <view v-if="isSuccess" class="rounded-full p-2 bg-[#52c41a]">
          <van-icon name="success" size="28" color="#fff" />
        </view>
        <view v-else class="rounded-full p-2 bg-[#e84335]">
          <van-icon name="cross" size="28" color="#fff" />
        </view>
        <view>{{ isSuccess ? '核销成功' : '核销失败' }}</view>
        <view class="text-[#777] text-base">
          {{ nowTime }}
        </view>
      </view>
      // 用户信息
      <view v-if="isSuccess" class="w-full flex flex-col items-center p-2 mb-2 rounded-md box-border bg-white">
        <van-image
          width="60"
          height="60"
          round
          :src="cardInfo.headPortrait"
          class="rounded-md"
        />
        <view class="text-center text-sm text-[#34495e]">
          {{ cardInfo.wechatName || cardInfo.weChatName }}
        </view>
      </view>

      <view v-if="isSuccess" class="w-full h-full rounded bg-white text-sm">
        <view class="flex justify-between items-center p-2 box-border">
          <view class="flex items-center">
            核销信息
          </view>
          <view class="box-border flex items-center text-xs" />
        </view>
        <van-divider custom-style="{margin-top: 4px; margin-bottom: 4px;}" />
        <view class="p-2 box-border flex">
          <van-image
            width="60"
            height="60"
            :src="cardInfo.resUrl"
            class="rounded-md"
          />
          <view class="text-sm px-2 flex-1 flex flex-col leading-6 text-[#888]">
            <view class="text-base font-600 text-black">
              {{ cardInfo.vouchersName }}
            </view>
            <view>
              {{ cardInfo.startTime }}-{{ cardInfo.endTime }}
            </view>
            <view>
              {{ cardInfo.jackpotNote || '暂无' }}
            </view>
            <view>
              {{ cardInfo.shopName }}
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="w-full flex items-center bg-white rounded-md mb-2">
      </view> -->
      <view class="w-full  box-border">
        <view class="w-full">
          <van-button
            block
            round
            custom-style="{background-color: #f2f2f2; color: black;}"
            @click="back()"
          >
            点击返回({{ countDown }}秒后自动返回)
          </van-button>
        </view>
      </view>
    </view>

    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged />
    </view>
  </container>
</template>

<style lang="scss" scoped>
::v-deep .van-image {
  display: block;
}
</style>
