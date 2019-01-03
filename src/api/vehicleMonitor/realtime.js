// @Author: outman_qiaopeng  Date: 2018-10-17 09:08:43
import request from '@/utils/request'

export function deleteMsg(data) {
  return request({
    url: '/alarm/record/contentModle/{id}',
    method: 'delete',
    data
  })
}

export function getBaseDept(data) {
  return request({
    url: '/moni/monitoring/getChildrenList',
    method: 'get',
    params: data
  })
}

export function getVehicleList(data) {
  return request({
    url: '/moni/monitoring/vehicleSearch',
    method: 'get',
    params: data
  })
}

export function getVehicleInfo(data) {
  return request({
    url: '/moni/monitoring/vehOtherInfo',
    method: 'get',
    params: data
  })
}
// 报警类型数据
export function callAlarmtype() {
  return request({
    url: '/alarm/record/callAlarmtype',
    method: 'get'
  })
}

// 车辆报警处理列表数据
export function fetchList(data) {
  return request({
    url: '/alarm/record/vehiclecall',
    method: 'get',
    params: data
  })
}
export function getMsgList(params) {
  return request({
    url: '/alarm/record/contentModle',
    method: 'get',
    params
  })
}
export function addMsg(data) {
  return request({
    url: '/alarm/record/contentModle',
    method: 'post',
    data
  })
}
