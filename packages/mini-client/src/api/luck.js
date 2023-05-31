import { post } from './index'

/**
 * 获取奖包
 * @param params
 * @returns {Promise<*>}
 */
export function getLotteryTicketShop(params) {
  return post('/jackpot/jackpotInfo/getLotteryTicketShop', params)
}

/**
 * 获取奖包详情
 * @param params
 * @returns {Promise<*>}
 */
export function getLotteryTicketDetailed(params) {
  return post('/jackpot/jackpotInfo/getLotteryTicketDetailed', params)
}

/**
 * 确认领奖
 * @param params
 * @returns {Promise<*>}
 */
export function updateUserDraw(params) {
  return post('/jackpot/jackpotInfo/updateUserDraw', params)
}

/**
 * 查询核销历史
 * @param params
 * @returns {Promise<*>}
 */
export function getLotteryRecord(params) {
  return post('/jackpot/jackpotInfo/getLotteryRecord', params)
}

/**
 * 查询核销详情
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function getLotteryDetailed(params) {
  return post('/jackpot/jackpotInfo/getLotteryDetailed', params)
}

/**
 * 生成二维码
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function getConsumQrCode(params, config) {
  return post('/jackpot/jackpotInfo/getConsumQrCode', params, config)
}

/**
 * 扫描领奖
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function addAwardRecord(params) {
  return post('/jackpot/jackpotInfo/addAwardRecord', params)
}
