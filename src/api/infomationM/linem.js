import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/fence/line',
    method: 'get',
    params
  })
}

export function addLine(data) {
  return request({
    url: '/fence/line',
    method: 'post',
    data
  })
}

export function fetchLine(id) {
  return request({
    url: `/fence/line/${id}`,
    method: 'get'
  })
}

export function updateLine(data) {
  return request({
    url: `/fence/line`,
    method: 'put',
    data
  })
}

export function deleteLine(id) {
  return request({
    url: `/fence/line/${id}`,
    method: 'delete'
  })
}

