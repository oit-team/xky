<script>
import { convertImageSize } from '@/utils/helper'
import notLogged from '@/components/business/notLogged/notLogged'

export default {
  name: 'index',
  components: {
    NotLogged: notLogged,
  },
  data() {
    return { }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    logged() {
      return this.$store.getters.logged
    },
  },
  methods: {
    convertImageSize,
    login() {
      this.userInfo = this.$store.state.userInfo
    },
    call() {
      uni.makePhoneCall({
        phoneNumber: '10086', // 仅为示例
      })
    },
    scan() {
      uni.scanCode({
        scanType: ['qrCode'],
        onlyFromCamera: true,
        success(res) {
          const data = res.result
          const url = encodeURIComponent(data)
          uni.navigateTo({
            url: `/pages/index/confirm?q=${url}`,
          })
        },
        fail(err) {
          this.$toast.fail(err)
        },
      })
    },
    toInfo() {
      uni.navigateTo({
        url: '/pages/my/info',
      })
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center justify-center bg-neutral-100">
    <view v-if="logged" class="w-full flex-1 flex-col">
      <view class="h-full py-3 flex flex-col items-center" @click="toInfo">
        <van-image
          width="5rem"
          height="5rem"
          :src="userInfo.headPortrait"
          round
          class="rounded-sm"
        />
        <view class="pt-1">
          {{ userInfo.wechatName || userInfo.weChatName }}
        </view>
      </view>
      <view class="px-1 w-full flex-1 py-2 box-border">
        <van-cell-group inset>
          <van-cell title="扫一扫" is-link @click="scan()">
            <van-icon slot="icon" name="scan" size="18" class="mr-2" />
          </van-cell>
          <van-cell title="隐私与协议" is-link @click="uni.navigateTo({ url: '/pages/my/agreement' })">
            <van-icon slot="icon" name="warn-o" size="18" class="mr-2" />
          </van-cell>
          <van-cell title="联系我们" is-link @click="call()">
            <van-icon slot="icon" name="phone-o" size="18" class="mr-2" />
          </van-cell>
        </van-cell-group>
      </view>
    </view>
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged @login="login" />
    </view>
  </container>
</template>

<style scoped>
::v-deep .van-image {
    display: block
}
</style>
