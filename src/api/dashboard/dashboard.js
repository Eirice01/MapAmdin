// @Author: zhangbo  Date: 2018-11-15 11:42:13
import request from '@/utils/request'

/**
 * 获取运营仪表盘信息（车辆总数/上下线/在线率/预警及预警处理统计）
 */
export function queryDashInfo(query) {
  return request({
    url: '/home/tabulateStatistics',
    method: 'get',
    params: query
  })
}

/**
 * 智能防控预警统计
 */
export function queryAlarmStatistics(query) {
  return request({
    url: '/home/alarmStatistics',
    method: 'get',
    params: query
  })
}

/**
 * 智能防控预警分布
 */
export function queryAlarmDistribute(query) {
  return request({
    url: '/home/alarmDistribute',
    method: 'get',
    params: query
  })
}

/**
 * 智能防控预警分布
 */
export function queryAlarmTendency(query) {
  return request({
    url: '/home/alarmTendency',
    method: 'get',
    params: query
  })
}

/**
 * 车辆预警排名
 */
export function queryVehicleRank(query) {
  return request({
    url: '/home/vehicleRanke',
    method: 'get',
    params: query
  })
}

/**
 * 车辆预警趋势
 */
export function queryVehicleAlarmTendency(query) {
  return request({
    url: '/home/vehicleAlarmTendency',
    method: 'get',
    params: query
  })
}

/**
 * 车辆预警类型分布
 */
export function queryVehicleAlarmDistribute(query) {
  return request({
    url: '/home/vehicleAlarmDistribute',
    method: 'get',
    params: query
  })
}

/**
 * 车辆报警统计
 */
export function queryVehicleAlarmStatistics(query) {
  return request({
    url: '/home/vehicleAlarmStatistics',
    method: 'get',
    params: query
  })
}
