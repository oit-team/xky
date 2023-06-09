<script>
import notLogged from '../../components/business/notLogged/notLogged'
import { parseURLQueryParams } from '../../utils/helper'
import { verificationServiceOrder } from '@/api/service'

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
      const res = await verificationServiceOrder({ content: this.opt })
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
      uni.redirectTo({
        url: '/pages/serviceOrder/orderList',
      })
    },
  },
}
</script>

<template>
  <container classes="h-full w-full flex justify-center bg-gray-100">
    <view v-if="logged" class="flex mt-8 flex-col items-center px-2">
      <view class="m-8 text-2xl font-bold text-green-500">
        <van-icon class="pr-2" name="passed" />
        {{ isSuccess ? '核销完成' : '核销失败' }}
      </view>
      <view v-if="isSuccess" class="w-full flex p-2 box-border bg-white rounded-md mb-8 overflow-hidden">
        <van-image
          width="100"
          height="100"
          radius="5px"
          :src="cardInfo.resourceUrl"
          class="rounded-md"
        />
        <view class="text-xs px-2 flex flex-col leading-6 text-[#34495e]">
          <p class="w-full truncate font-bold text-lg">
            {{ cardInfo.serviceName }}
          </p>
          <view>
            用户：{{ cardInfo.userName }}
          </view>
          <view>
            手机号：{{ cardInfo.telephone }}
          </view>
          <view>
            下单时间：{{ cardInfo.createTime }}
          </view>
          <!-- <view>
            备注：{{ cardInfo.remarks }}
          </view> -->
        </view>
      </view>

      <view class="w-full px-4 box-border">
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
