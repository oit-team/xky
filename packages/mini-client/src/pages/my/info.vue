<script>
export default {
  components: {},
  data() {
    return {
      name: 'Vue',
      // headPortrait: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    }
  },
  computed: {
    info() {
      return this.$store.state.userInfo
    },
    weChatName() {
      return this.$store.state.userInfo.weChatName
    },
    avatarUrl() {
      return this.$store.state.userInfo.headPortrait
    },
  },
  onShow() {
    this.useVantModel(['weChatName', 'headPortrait'])
  },
  methods: {
    onChooseAvatar(e) {
      this.$store.commit('setHeadPortrait', e.detail.avatarUrl)
    },
    onBlur(e) {
      this.info.weChatName = e.detail.value.trim()
    },
    onInput(e) {
      this.info.weChatName = e.detail.trim()
    },
    submit() {
      this.info.headPortrait = this.avatarUrl
      this.$store.commit('setUserInfo', this.info)
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <container classes="w-full h-full bg-neutral-100 p-2">
    <view class="w-full">
      <button open-type="chooseAvatar" class="w-full flex justify-center py-2 bg-white" @chooseavatar="onChooseAvatar">
        <image :src="avatarUrl" class="w-50px h-50px rounded-lg" />
      </button>
    </view>

    <van-field
      v-model="weChatName"
      type="nickname"
      placeholder="请输入昵称"
      label="昵称"
      @blur="onBlur"
      @input="onInput"
    />

    <van-button block class="block mt-2" type="primary" @click="submit">
      确认
    </van-button>
  </container>
</template>

<style lang="scss" scoped>

</style>
