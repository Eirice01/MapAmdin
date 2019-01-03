// @Author: gaoyujie  Date: 2018-10-18
import request from '@/utils/request'

export function getTree(query) {
  return request({
    url: '/moni/monitoring/depttree',
    method: 'get',
    params: query
  })
}

export function getVehicleList(query) {
  return request({
    url: '/moni/monitoring/vehicleList',
    method: 'get',
    params: query
  })
}
