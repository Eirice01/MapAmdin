import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/fence/area',
    method: 'get',
    params
  })
}

export function addFence(data) {
  return request({
    url: '/fence/area',
    method: 'post',
    data
  })
}

export function fetchFence(id) {
  return request({
    url: `/fence/area/${id}`,
    method: 'get'
  })
}

export function updateFence(data) {
  return request({
    url: `/fence/area/`,
    method: 'put',
    data
  })
}

export function deleteFence(id) {
  return request({
    url: `/fence/area/${id}`,
    method: 'delete'
  })
}

