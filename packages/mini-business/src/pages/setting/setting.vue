<script>
export default {
  name: 'setting',
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
      </van-cell-group>
    </view>
  </container>
</template>

<style lang='scss' scoped>

</style>
