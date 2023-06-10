import { post } from './index'

/**
 * 服务预约
 * @param {*} params
 * @returns
 */
export function getAppointmentReport(params) {
  return post('/liveBroadcast/home/getAppointmentReport', params)
}

/**
 * 抽奖互动
 * @param {*} params
 * @returns
 */
export function getLotteryInteraction(params) {
  return post('/liveBroadcast/home/getLotteryInteraction', params)
}
