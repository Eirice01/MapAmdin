import request from '@/utils/request'

/**
 * 预警列表查询
 */
export function fetchList(params) {
  return request({
    url: '/alarm/record/find',
    method: 'get',
    params
  })
}

export function exportImgVideo(params) {
  return request({
    responseType: 'blob',
    url: '/alarm/record/download',
    method: 'get',
    params
  })
}

export function getAlarmType() {
  return request({
    url: '/alarm/record/alarmtype',
    method: 'get'
  })
}
