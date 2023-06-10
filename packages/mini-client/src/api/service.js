import { post } from './index'

export function getServiceInfoList(params) {
  return post('/system/serviceInfo/getServiceInfoList', params)
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
 * 服务订单核销扫一扫
 */
export function verificationServiceOrder(params) {
  return post('/system/serviceOrder/verificationServiceOrder', params)
}
