import { post } from './index'

export function getIndustryAll() {
  return post('/system/brand/getIndustryAll')
}

export function getDictItemList(params) {
  return post('/system/dictInfo/getDictItemList', {
    ...params,
    code: 1,
  })
}

export function getShopById(params) {
  return post('/system/shop/getShopById', params)
}

/**
 * 获取订单列表
 * @param {*} params
 * @returns
 */
export function getServiceOrderListForWeChatC(params) {
  return post('/system/serviceOrder/getServiceOrderListForWeChatC', params)
}
