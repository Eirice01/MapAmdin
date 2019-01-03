import request from '@/utils/request'

export function subList(params) {
  return request({
    url: '/alarm/line',
    method: 'get',
    params
  })
}

export function addLineAlarm(data) {
  return request({
    url: '/alarm/line',
    method: 'post',
    data
  })
}

export function fetchInfo(id) {
  return request({
    url: `/alarm/line/${id}`,
    method: 'get'
  })
}

export function deleteRule(id) {
  return request({
    url: `/alarm/line/${id}`,
    method: 'delete'
  })
}

export function updateRule(data) {
  return request({
    url: `/alarm/line`,
    method: 'put',
    data
  })
}
