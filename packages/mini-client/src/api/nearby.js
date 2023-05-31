import { post } from './index'

export function getNearbyMerchants(params) {
  return post('/jackpot/jackpotInfo/getNearbyMerchants', params)
}
