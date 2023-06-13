import Toast from '@/wxcomponents/vant/toast/toast'

let promiseLoadingDelay = null

/**
 * 根据promise状态显示loading效果
 * @param {Promise | Promise[]} promises
 * @param config
 */
export function promiseLoading(promises, config) {
  config = typeof config === 'string' ? { message: config } : config

  promiseLoadingDelay = setTimeout(() => {
    Toast.loading({
      message: '正在加载...',
      duration: 60000,
      forbidClick: true,
      ...config,
    })
  }, Number(config?.delay ?? 200))

  const closeToast = () => {
    clearTimeout(promiseLoadingDelay)
    Toast.clear()
    setTimeout(Toast.clear, 200)
  }

  // 数组时执行all方法
  if (Array.isArray(promises))
    return Promise.all(promises).finally(closeToast)
  return promises.finally(closeToast)
}

/**
 * 截取URl 携带的参数
 * @param URL
 * @returns {*}
 */
export function parseURLQueryParams(URL) {
  const url = URL.split('?')[1]
  const arr = url.split('&')
  // return arr.reduce((prev, curr) => {
  //   const param = curr.split('=')
  //   prev[param[0]] = param[1]
  //   return prev
  // }, {})
  return arr.substr(url.indexOf('=') + 1)
}

/**
 * 断言
 * @param {boolean} check 断言结果
 * @param {string} msg 失败提示
 * @returns
 */
export function assert(check, msg) {
  return new Promise((resolve, reject) => {
    return check ? resolve() : reject(msg)
  })
}

// 图片优化
export function convertImageSize(img, size = 's') {
  return img && img.replace(/(.*)\./, `$1_${size}.`)
}

export async function unwrapPromise(promise) {
  const [err, res] = await promise
  if (err)
    throw err
  return res
}
