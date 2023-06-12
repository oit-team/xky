<script>
import crypto from '../../utils/crypto'
import { updatePassWord } from '@/api/account'

export default {
  data: () => ({
    oldPassWord: '',
    newPassWord: '',
    checkPassWord: '',
  }),
  methods: {
    async submit() {
      if (this.checkPassWord !== this.newPassWord)
        return this.$toast.fail('两次输入新密码不一致')

      await this.$dialog.confirm({ title: '提示', message: '确定修改吗？' })

      const old = crypto.encrypt(this.oldPassWord)
      const n = crypto.encrypt(this.newPassWord)
      await updatePassWord({
        newPassWord: n,
        oldPassWord: old,
      })

      this.$toast.success('修改成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 800)
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100 p-2 box-border">
    <view class="w-full flex-1">
      <van-cell-group>
        <van-field
          :value="oldPassWord"
          label="旧密码"
          border="false"
          @change="($event) => oldPassWord = $event.detail"
        />
        <van-field
          :value="newPassWord"
          label="新密码"
          border="false"
          password
          @change="($event) => newPassWord = $event.detail"
        />
        <van-field
          :value="checkPassWord"
          label="确认新密码"
          border="false"
          password
          @change="($event) => checkPassWord = $event.detail"
        />
      </van-cell-group>
      <view class="mt-2">
        <van-button color="#6FA7FF" block @click="submit">
          提交
        </van-button>
      </view>
    </view>
  </container>
</template>

<style lang='scss' scoped>

</style>
