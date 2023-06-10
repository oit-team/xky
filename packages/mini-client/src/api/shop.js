import { post } from './index'

// 商品
export function getProductAll(params) {
  return post('/goods/product/getProductAll', params)
}

// 服务
export function getServiceInfos(params) {
  return post('/system/serviceInfo/getServiceInfos', params)
}

export function getServiceInfoDetail(params) {
  return post('/system/serviceInfo/getServiceInfoDetail', params)
}

export function getServiceOrderList(params) {
  return post('/system/serviceOrder/getServiceOrderList', params)
}

export function getServiceOrderDetail(params) {
  return post('/system/serviceOrder/getServiceOrderDetail', params)
}

/**
 * 添加活动订单
 * @param {*} params
 * @returns
 */
export function addServiceOrder(params) {
  return post('/system/serviceOrder/addServiceOrder', params)
}

// 活动

/**
 * 获取活动列表
 * @param {*} params
 * @returns
 */
export function getActivityList(params) {
  return post('jackpot/activity/getActivityList', params)
}

/**
 * 获取活动详情
 * @param {*} params
 * @returns
 */
export function getActivityById(params) {
  return post('jackpot/activity/getActivityById', params)
}

/**
 *  参与活动
 * @param {*} params
 * @returns
 */
export function addParticipateActivity(params) {
  return post('jackpot/activity/addParticipateActivity', params)
}
