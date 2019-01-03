
import request from '@/utils/request'

// 实时区域查车
export function getVehicles(params) {
  return request({
    url: '/base/area/getVehicles',
    method: 'get',
    params
  })
}
// 获取区域内车辆-监控-司机信息
export function realTimeData(params) {
  return request({
    url: '/base/area/realTimeData',
    method: 'get',
    params
  })
}
