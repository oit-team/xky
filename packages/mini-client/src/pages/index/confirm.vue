<script>
import { addAwardRecord } from '@/api/luck'
import notLogged from '@/components/business/notLogged/notLogged'

export default {
  name: 'confirm',
  components: {
    NotLogged: notLogged,
  },
  data() {
    return {
      countDown: 8,
      timer: null,
      isSuccess: false,
      opt: '',
      cardInfo: {},
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  async onLoad(op) {
    this.opt = this.parseURLQueryParams(decodeURIComponent(op.q))
    if (this.logged) {
      await this.$store.state.userPromise
      this.getData()
    }
  },
  onShow() {
    if (this.logged)
      this.setTime()
  },
  onHide() {
    clearInterval(this.timer)
  },
  methods: {
    async getData() {
      const res = await addAwardRecord({ content: this.opt })
      if (res.head.status !== 0) {
        this.isSuccess = false
      }
      else {
        this.isSuccess = true
        this.cardInfo = res.body
        this.$toast.success('核销成功')
      }
    },
    parseURLQueryParams(URL) {
      const url = URL.split('?')[1]
      // const arr = url.split('&')
      // return arr.reduce((prev, curr) => {
      //   const param = curr.split('=')
      //   prev[param[0]] = param[1]
      //   return prev
      // }, {})
      return url.substring(url.indexOf('=') + 1)
    },
    back() {
      clearInterval(this.timer)
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
    async login() {
      await this.$loading(
        this.$store.dispatch('wxLogin'),
        {
          message: '正在登录...',
          delay: false,
        },
      )
      await this.getData()
      this.setTime()
    },
    setTime() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          this.back()
          clearInterval(this.timer)
        }
      }, 1000)
    },
  },
}
</script>

<template>
  <container classes="flex justify-center items-center bg-gray-100">
    <view v-if="logged" class="flex flex-col items-center px-2">
      <view class="mb-4">
        {{ isSuccess ? '领奖完成' : '领奖失败' }}
      </view>
      <view v-if="isSuccess" class="w-full flex items-center p-2 box-border bg-white rounded-md mb-2">
        <van-image
          width="60"
          height="60"
          :src="cardInfo.imgUrl"
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
            {{ cardInfo.effectiveStart }}-{{ cardInfo.effectiveEnd }}
          </view>
        </view>
      </view>
      <view v-else class="flex items-center">
        <van-empty image="error" description="领奖失败" />
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
      <not-logged @login="login" />
    </view>
  </container>
</template>

<style lang="scss" scoped>
::v-deep .van-image {
  display: block
}
</style>
