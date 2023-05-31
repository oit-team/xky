import { post } from './index'

// 微信登录
export function wxLogin(params) {
  return post('/system/user/getUserAuthorization', params)
}

// 退出登录
export function logout() {
  return post('/system/user/logout')
}

// 更新用户信息
export function updateUserInfo() {
  return post('/system/user/getTokenWeChatUser')
}
