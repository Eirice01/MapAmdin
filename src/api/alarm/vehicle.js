import request from '@/utils/request'

export function vehicleList(params) {
  return request({
    url: '/alarm/all',
    method: 'get',
    params
  })
}

export function addRule(data) {
  return request({
    url: '/alarm',
    method: 'post',
    data
  })
}

export function fetchInfo(id) {
  return request({
    url: `/alarm/area/${id}`,
    method: 'get'
  })
}

export function updateRule(data) {
  return request({
    url: `/alarm`,
    method: 'put',
    data
  })
}

export function deleteRule(id) {
  return request({
    url: `/alarm/${id}`,
    method: 'delete'
  })
}

export function getCarList(params) {
  return request({
    url: '/alarm/vehicle',
    method: 'get',
    params
  })
}

export function allotCar(data) {
  return request({
    url: `/alarm/assigned/${data.allot}`,
    method: 'post',
    data
  })
}
