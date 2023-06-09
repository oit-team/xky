<script>
import notLogged from '../../components/business/notLogged/notLogged'

export default {
  components: {
    NotLogged: notLogged,
  },
  data() {
    return {
      showPicker: false,
    }
  },
  onShow() {
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  methods: {
    login() {
      this.$dialog.confirm({
        title: '提示',
        message: '确认退出登录',
      }).then(() => {
        uni.clearStorageSync()
        uni.reLaunch({
          url: '/pages/login/login',
        })
      })
    },
    toWriteOff() {
      uni.navigateTo({
        url: '/pages/activity/writeOff',
      })
    },
    toServiceOrder() {
      uni.navigateTo({
        url: '/pages/serviceOrder/orderList',
      })
    },
    // 扫码
    scan() {
      uni.scanCode({
        scanType: ['qrCode'],
        onlyFromCamera: true,
        success(res) {
          const data = res.result
          // 去订单核销页
          const toServerOrderPage = data.split('?')[0].includes('serverOrder')

          const url = encodeURIComponent(data)
          if (toServerOrderPage) {
            uni.navigateTo({
              url: `/pages/serviceOrder/confirm?q=${url}`,
            })
          }
          else {
            uni.navigateTo({
              url: `/pages/activity/confirm?q=${url}`,
            })
          }
        },
        fail(err) {
          this.$toast.fail(err)
        },
      })
    },
    toActivity() {
      uni.navigateTo({
        url: '/pages/activity/activity',
      })
    },
    toSetting() {
      uni.navigateTo({
        url: '/pages/setting/setting',
      })
    },
    toGoods() {
      uni.navigateTo({
        url: '/pages/product/list',
      })
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <view v-if="logged" class="flex-1 rounded-xl w-full">
      <view class="w-full flex flex-col justify-center items-center py-3">
        <van-image
          width="5rem"
          height="5rem"
          round
          :src="userInfo.headPortrait"
        />
        <view class="pt-1 text-[#34495e] text-sm">
          {{ userInfo.nickName }}
        </view>
      </view>
      <van-cell-group inset>
        <van-cell title="扫一扫" is-link @click="scan()">
          <van-icon slot="icon" name="scan" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="预约订单" is-link @click="toServiceOrder()">
          <van-icon
            slot="icon"
            name="balance-list-o"
            size="18"
            class="mr-2"
          />
        </van-cell>
        <van-cell title="商品列表" is-link @click="toGoods()">
          <van-icon
            slot="icon"
            name="orders-o"
            size="18"
            class="mr-2"
          />
        </van-cell>
        <van-cell title="核销记录" is-link @click="toWriteOff()">
          <van-icon slot="icon" name="coupon-o" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="感兴趣" is-link @click="uni.navigateTo({ url: '/pages/my/largeList' })">
          <van-icon slot="icon" name="like-o" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="奖池" is-link @click="scan()">
          <van-icon slot="icon" name="scan" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="系统设置" is-link @click="toSetting()">
          <van-icon slot="icon" name="setting-o" size="18" class="mr-2" />
        </van-cell>
      </van-cell-group>
      <view class="w-full mt-2 flex justify-center">
        <view class="w-1/2 ">
          <van-button
            type="info"
            block
            plain
            round
            class="w-full"
            @click="login()"
          >
            退出登录
          </van-button>
        </view>
      </view>
    </view>
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged />
    </view>
  </container>
</template>

<style scoped>
::v-deep .van-image {
  display: block;
}
</style>
