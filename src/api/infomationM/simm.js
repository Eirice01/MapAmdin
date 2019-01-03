import request from '@/utils/request'

export function fetchList(params) {
  console.log(params)
  return request({
    url: '/sim',
    method: 'get',
    params
  })
}

export function addSim(data) {
  return request({
    url: '/sim',
    method: 'post',
    data
  })
}

export function fetchSim(id) {
  return request({
    url: `/sim/${id}`,
    method: 'get'
  })
}

export function updateSim(data) {
  return request({
    url: `/sim`,
    method: 'put',
    data
  })
}

export function deleteSim(id) {
  return request({
    url: `/sim/${id}`,
    method: 'delete'
  })
}
