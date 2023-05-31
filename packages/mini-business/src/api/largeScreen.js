import { post } from './index'

export function getAppDevList(params) {
  return post('/liveBroadcast/device/getAppDevList', params)
}

// 查询设备
export function getDevState(params) {
  return post('/liveBroadcast/device/getDevState', params)
}

// 发布
export function addAppPublishDeviceAds(params) {
  return post('/liveBroadcast/device/addAppPublishDeviceAds', params)
}

// 添加草稿
export function addAdvertsTemp(params) {
  return post('/liveBroadcast/adverts/addAdvertsTemp', params)
}

// 回退配置
export function getRollbackAdverts(devId) {
  return post('/liveBroadcast/adverts/getRollbackAdverts', { devId })
}

// 查询设备详情
export function getAppDevInfo(devId) {
  return post('/liveBroadcast/device/getAppDevInfo', { devId })
}

/**
 * 店铺广告模板列表
 * @param params
 */
export function getAdvertsShopAll(params) {
  return post('/liveBroadcast/advertsShop/getAdvertsShopAll', params)
}

/**
 * 新增模板
 * @param params
 */
export function addAdvertsShop(params) {
  return post('/liveBroadcast/advertsShop/addAdvertsShop', params)
}

/**
 * 查看模板详情
 * @param params
 */
export function getAdvertsShopById(params) {
  return post('/liveBroadcast/advertsShop/getAdvertsShopById', params)
}

/**
 * 修改模板
 * @param params
 */
export function updateAdvertsShop(params) {
  return post('/liveBroadcast/advertsShop/updateAdvertsShop', params)
}

/**
 * 删除模板
 * @param params
 */
export function deleteAdvertsShop(params) {
  return post('/liveBroadcast/advertsShop/deleteAdvertsShop', params)
}

/**
 * 获取商品分类
 * @param params
 */
export function getStyleType(params, config) {
  return post('/liveBroadcast/adverts/getStyleType', params, config)
}

/**
 * 根据分类获取商品列表
 * @param params
 */
export function getCollocationList(params) {
  return post('/liveBroadcast/adverts/getCollocationList', params)
}

// 查询设备数量
export function getDevCount() {
  return post('/liveBroadcast/device/getDevCount')
}

/**
 * 商品图片列表
 */
export function getAdvertsRes(params) {
  return post('/liveBroadcast/adverts/getAdvertsRes', params)
}

/**
 * 商品图片列表
 */
export function getStyleList(params) {
  return post('/liveBroadcast/adverts/getStyleList', params)
}

/**
 * 控制大屏显示模块
 */
export function sendCommandToDevice(params) {
  return post('/liveBroadcast/device/sendCommandToDevice', params)
}
