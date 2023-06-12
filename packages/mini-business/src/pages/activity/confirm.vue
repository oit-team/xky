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
      cardInfo: {
        // headPortrait: 'https://picsum.photos/200/300',
        // wechatName: '张宇',
        // vouchersName: '的说法',
        // startTime: '2001/5/62',
        // endTime: '2325/45/5',
        // jackpotNote: '似懂非懂的点点滴反反复复凤飞飞反反复复方法滴哒哒哒哒哒哒',
        // shopName: '的士速递的点点滴滴滴滴答答哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒哒',
      },
      nowTime: dayjs().format('YYYY/MM/DD HH:mm:ss'),
      errMsg: '',
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
        this.errMsg = res.head.msg
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
  <container classes="h-full w-full flex flex-col items-center bg-gray-100 text-sm">
    <view v-if="logged" class="flex flex-col flex-1 items-center w-full px-2 mt-12 box-border">
      <view class="mb-4 w-full  text-center">
        <view v-if="isSuccess" class="rounded-full w-80px h-80px flex justify-center items-center p-2 m-auto bg-[#52c41a]">
          <van-icon name="success" size="40px" color="#fff" />
        </view>
        <view v-else class="rounded-full w-80px h-80px flex items-center justify-center bg-[#e84335] m-auto">
          <van-icon name="cross" size="40px" color="#fff" />
        </view>
        <view class="text-lg my-2">
          {{ isSuccess ? '核销成功' : '核销失败' }}
        </view>
        <view v-if="!isSuccess" class="text-[#777] mb-2">
          {{ errMsg }}
        </view>
        <view class="text-[#777]">
          {{ nowTime }}
        </view>
      </view>
      <!-- 用户信息 -->
      <!-- <view v-if="isSuccess" class="w-full flex flex-col items-center p-2 mb-2 rounded-md box-border bg-white">
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
      </view> -->
      <!-- 核销信息 -->
      <view v-if="isSuccess" class="w-full h-full rounded bg-white text-sm">
        <view class="flex justify-between items-center p-2 box-border">
          <view class="flex items-center">
            核销信息
          </view>
          <view class="box-border flex items-center text-xs" />
        </view>
        <van-divider custom-style="margin: 0px;" />
        <view class="p-2 box-border flex items-center">
          <van-image
            width="80"
            height="80"
            :src="cardInfo.resUrl"
            class="rounded-md"
          />
          <view class="text-sm px-2 flex-1 flex flex-col leading-6 text-[#888] overflow-hidden">
            <view class="text-base font-600 text-black w-full truncate">
              {{ cardInfo.vouchersName }}
            </view>
            <view>
              {{ cardInfo.startTime }}-{{ cardInfo.endTime }}
            </view>
            <view class="w-full truncate">
              {{ cardInfo.jackpotNote || '暂无' }}
            </view>
            <view class="w-full truncate">
              {{ cardInfo.shopName }}
            </view>
          </view>
        </view>
      </view>
      <view class="w-full box-border  mt-2">
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
