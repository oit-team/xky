import { post } from './index'

export function getIndustryAll() {
  return post('/system/brand/getIndustryAll')
}

export function getDictItemList(params) {
  return post('/system/dictInfo/getDictItemList', params)
}

export function getShopById(params) {
  return post('/system/shop/getShopById', params)
}
