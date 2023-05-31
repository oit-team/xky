<script>
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
      sessionStorage.setItem('op-confrim', op)
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
        url: '/pages/activity/activity',
      })
    },
  },
}
</script>

<template>
  <container classes="h-full w-full flex justify-center items-center bg-gray-100">
    <view v-if="logged" class="flex flex-col items-center px-2">
      <view class="mb-4">
        {{ isSuccess ? '核销完成' : '核销失败' }}
      </view>
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
      <view v-if="isSuccess" class="w-full flex items-center p-2 box-border bg-white rounded-md mb-2">
        <van-image
          width="60"
          height="60"
          :src="cardInfo.resUrl"
          class="rounded-md"
        />
        <view class="text-sm px-2 flex flex-col leading-6 text-[#34495e]">
          <view>
            {{ cardInfo.vouchersName }}
          </view>
          <view>
            备注：{{ cardInfo.jackpotNote || '暂无' }}
          </view>
          <view>
            核销商家：{{ cardInfo.shopName }}
          </view>
          <view>
            {{ cardInfo.startTime }}-{{ cardInfo.endTime }}
          </view>
        </view>
      </view>
      <view class="w-full px-4  box-border">
        <view class="w-full">
          <van-button round type="info" class="w-full" block @click="back()">
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
