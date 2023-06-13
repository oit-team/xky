import { unwrapPromise } from './helper'

/**
 * 验证授权
 */
export function authorize(scope) {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: ({ authSetting }) => {
        if (authSetting[scope]) {
          return resolve()
        }
        else {
          uni.authorize({
            scope,
            success: resolve,
            fail: reject,
          })
        }
      },
      fail: reject,
    })
  })
}

/**
 * 获取用户位置
 */
export async function getFuzzyLocation() {
  await authorize('scope.userFuzzyLocation')
  return new Promise((resolve, reject) => {
    wx.getFuzzyLocation({
      type: 'wgs84',
      success: resolve,
      fail: reject,
    })
  })
}

export function wxPayment(data) {
  const {
    nonceStr,
    timeStamp,
    prepayid,
    paySign,
  } = data

  return unwrapPromise(
    uni.requestPayment({
      provider: 'wxpay',
      appid: 'wx5ae22dcebff902a0',
      // 微信支付商户号
      partnerid: '1646564735',
      // 随机字符串
      nonceStr,
      // 统一下单订单号
      package: `prepay_id=${prepayid}`,
      // 时间戳（单位：秒）
      timeStamp: String(timeStamp),
      // 签名
      signType: 'RSA',
      paySign,
    }),
  )
}
