<script>
import { clearToken, hasToken } from './utils/token'

export default {
  onLaunch() {
    hasToken() && this.$store.dispatch('updateUserInfo')
      .catch(() => {
        // 忽略错误
        clearToken()
        uni.reLaunch({
          url: '/pages/login/login',
        })
      })

    !hasToken() && uni.reLaunch({ url: '/pages/login/login' })
  },
  onShow() {
  },
  onHide() {
  },
}
</script>

<style>
page{
  --tabs-bottom-bar-color: #6FA7FF;
}

/*每个页面公共css */
.aspect-9-16 {
  aspect-ratio: 9/16;
}

.width-3-5 {
  width: 60%;
}

*::marker {
  content: '';
}

::v-deep .van-image {
  display: block
}
</style>
