import { post } from './index'

export function getShopAudioList(params) {
  return post('/system/shop/getShopAudioList', params)
}

export function addOrModifyShopAudioInfo(params) {
  return post('/system/shop/addOrModifyShopAudioInfo', params)
}
