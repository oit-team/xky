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
