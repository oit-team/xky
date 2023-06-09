import { post } from './index'

/**
 * 获取奖池列表
 * @param params
 * @returns {Promise<*>}
 */
export function getDrawProduct(params) {
  return post('/jackpot/jackpotInfo/getDrawProduct', params)
}

/**
 * 获取中奖名单
 * @param params
 * @returns {Promise<*>}
 */
export function getLuckyDrawRecord(params) {
  return post('/jackpot/jackpotInfo/getLuckyDrawRecord', params)
}

/**
 * 获取卡券详情
 * @param params
 * @returns {Promise<*>}
 */
export function getDrawDetailed(params) {
  return post('/jackpot/jackpotInfo/getDrawDetailed', params)
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
 * 扫描核销
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function addPrizeExchangeRecord(params) {
  return post('/jackpot/jackpotInfo/addPrizeExchangeRecord', params)
}

/**
 * 查询用户感兴趣的商品列表
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function getProductListById(params) {
  return post('/liveBroadcast/adverts/getProductListById', params)
}

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
 * 获取活动详情
 * @param {*} params
 * @returns
 */
export function addParticipateActivity(params) {
  return post('jackpot/activity/addParticipateActivity', params)
}

/**
 * 获取活动详情奖券列表
 * @param {*} params
 * @returns
 */
export function getActivityJackpotList(params) {
  return post('jackpot/jackpotInfo/getActivityJackpotList', params)
}

/**
 * 获取奖券列表
 * @param {*} params
 * @returns
 */
export function getJackpotStyleAll(params) {
  return post('jackpot/jackpotInfo/getJackpotStyleAll', params)
}

/**
 * 新增商家奖券
 * @param {*} params
 * @returns
 */
export function addAddActivityJackpot(params) {
  return post('/jackpot/activity/addAddActivityJackpot', params)
}

/**
 * 购买活动奖券下单
 * @param {*} params
 * @returns
 */
export function addActivityOrder(params) {
  return post('/jackpot/procurement/addActivityOrder', params)
}
