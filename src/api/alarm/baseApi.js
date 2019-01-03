import request from '@/utils/request'

/**
 * 获取车辆
 * @param params
 */
export function carList(params) {
  return request({
    url: '/track/replay/vehicleList',
    method: 'get',
    params
  })
}

/**
 * 获取机构树
 */
export function deptTree() {
  return request({
    url: '/sys/dept/tree',
    method: 'get'
  })
}

/**
 * 人工批量处理
 */
export function artificialHandle(params) {
  return request({
    url: '/alarm/record/batchHandle',
    method: 'PUT',
    params
  })
}
