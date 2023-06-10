<script>
export default {
  name: 'setting',
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
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <view class="w-full flex-1">
      <van-cell-group>
        <van-cell title="音频设置" is-link @click="uni.navigateTo({ url: '/pages/shopAudio/List' })">
          <van-icon slot="icon" name="volume-o" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="修改密码" is-link @click="uni.navigateTo({ url: '/pages/setting/editPassword' })">
          <van-icon slot="icon" name="edit" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="隐私与协议" is-link @click="uni.navigateTo({ url: '/pages/my/agreement' })">
          <van-icon slot="icon" name="warn-o" size="18" class="mr-2" />
        </van-cell>
        <van-cell title="版本号" is-link value="v1.0.0">
          <van-icon slot="icon" name="diamond-o" size="18" class="mr-2" />
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
  </container>
</template>

<style lang='scss' scoped>

</style>
