import { post } from './index'

export function getServiceInfoList(params) {
  return post('system/serviceInfo/getServiceInfoList', params)
}
