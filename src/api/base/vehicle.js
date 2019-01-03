// @Author: outman_qiaopeng  Date: 2018-09-18 16:55:13
import request from '@/utils/request'

/**
 * 车辆列表
 */
export function vehicleList(query) {
  return request({
    url: '/base/vehicle',
    method: 'get',
    params: query
  })
}

/**
 * 新增车辆
 * @param {*} 表单数据
 */
export function createVehicle(data) {
  return request({
    url: '/base/vehicle',
    method: 'post',
    data
  })
}

/**
 * 修改车辆
 * @param {*} json格式参数
 */
export function updateVehicle(data) {
  return request({
    url: '/base/vehicle',
    method: 'put',
    data
  })
}

/**
 * 删除车辆
 * @param id 车辆id数组格式
 */
export function deleteVehicle(id) {
  return request({
    url: '/base/vehicle/' + id.join(),
    method: 'delete'
  })
}

/**
 * 车辆详情
 * @param id 车辆id
 */
export function detailVehicle(id) {
  return request({
    url: '/base/vehicle/' + id,
    method: 'get'
  })
}

/**
 * 快速加车
 */
export function quickAddVehicle(data) {
  return request({
    url: '/base/vehicle/quick',
    method: 'post',
    data
  })
}

/**
 * 未绑定设备列表
 */
export function unBindDeviceList(query) {
  return request({
    url: '/base/device/notDound',
    method: 'get',
    params: query
  })
}

/**
 * 未绑定设备列表
 */
export function bindingDevice(data) {
  return request({
    url: '/sys/device/bindingDevice',
    method: 'post',
    data
  })
}

/**
 * 查询司机列表
 */
export function getDriverList(query) {
  return request({
    url: '/sys/driver',
    method: 'get',
    params: query
  })
}

/**
 * 查询SIM详情
 */
export function getSimDetail(id) {
  return request({
    url: '/sim/' + id,
    method: 'get'
  })
}

/**
 * 设备重新绑定SIM卡
 */
export function changeBindStatus(data) {
  return request({
    url: '/sys/device/bindingSim',
    method: 'post',
    data
  })
}

/**
 * 新增外设
 */
export function createExtraDevice(data) {
  return request({
    url: '/sys/deviceextend',
    method: 'post',
    data
  })
}

/**
 * 外设详情
 */
export function extraDeviceDetail(id) {
  return request({
    url: '/sys/deviceextend/' + id,
    method: 'get'
  })
}

/**
 * 批量修改机构
 */
export function updateDept(data) {
  return request({
    url: '/base/vehicle/deptId',
    method: 'put',
    data
  })
}

/**
 * 获取下载模板url
 */
export function getModelUrl() {
  return request({
    url: '/base/vehicle/modle',
    method: 'get'
  })
}

/**
 * 车辆导入
 */
export function importVehicle(data) {
  return request({
    url: '/base/vehicle/excelImport',
    method: 'post',
    data
  })
}

/**
 * 车辆列表
 */
export function vehicleStatusList(query) {
  return request({
    url: '/base/vehicle/vehicleStatus',
    method: 'get',
    params: query
  })
}
