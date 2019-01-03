import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/sys/driver',
    method: 'get',
    params: data
  })
}

export function addDriver(data) {
  return request({
    url: '/sys/driver',
    method: 'post',
    data
  })
}

export function fetchDriver(id) {
  return request({
    url: `/sys/driver/${id}`,
    method: 'get'
  })
}

export function updateDriver(data) {
  return request({
    url: `/sys/driver`,
    method: 'put',
    data
  })
}

export function deleteDriver(id) {
  return request({
    url: `/sys/driver/${id}`,
    method: 'delete'
  })
}
