<script>
import { clearToken, hasToken } from './utils/token'

export default {
  onLaunch() {
    hasToken() && this.$store.dispatch('updateUserInfo')
      .catch(() => {
        // 忽略错误
        clearToken()
      })
  },
  onShow() {
    console.info('App Show')
  },
  onHide() {
    console.info('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
::v-deep van-image{
  display: block;
}
::v-deep .van-image__img {
  border-radius: 4px;
}
.van-multi-ellipsis--l2{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
