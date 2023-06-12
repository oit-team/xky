import { post } from './index'

/**
 * 服务预约
 * @param {*} params
 * @returns
 */
export function getAppointmentReport() {
  return post('/liveBroadcast/home/getAppointmentReport')
}

/**
 * 抽奖互动
 * @param {*} params
 * @returns
 */
export function getLotteryInteraction() {
  return post('/liveBroadcast/home/getLotteryInteraction')
}
