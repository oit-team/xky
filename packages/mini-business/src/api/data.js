import { post } from './index'

export function getAppointmentReport(params) {
  return post('/liveBroadcast/home/getAppointmentReport', params)
}
