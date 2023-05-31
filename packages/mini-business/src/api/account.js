import { post } from './index'

export function userLogin(params) {
  return post('/system/user/merchantLogin', params)
}

// 根据token  获取用户信息
export function getTokenUser() {
  return post('/system/user/getTokenUser')
}
