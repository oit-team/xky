import { post } from './index.js'

export function addUserBehaviorRecord(params) {
  return post('/log/behavior/addUserBehaviorRecord', params)
}
