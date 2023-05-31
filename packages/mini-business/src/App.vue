<script>
import { clearToken, hasToken } from './utils/token'

export default {
  onLaunch() {
    hasToken() && this.$store.dispatch('updateUserInfo')
      .catch(() => {
        this.$toast('请先进行登录')
        // 忽略错误
        clearToken()
      })
  },
  onShow() {
  },
  onHide() {
  },
}
</script>

<style>
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
