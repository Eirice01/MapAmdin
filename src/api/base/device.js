// @Author: outman_qiaopeng  Date: 2018-09-18 16:09:19
import request from '@/utils/request'

/**
 * 设备列表
 */
export function fetchList(query) {
  return request({
    url: '/sys/device',
    method: 'get',
    params: query
  })
}

/**
 * 新增设备
 * @param {*} 表单数据
 */
export function createDevice(data) {
  return request({
    url: '/sys/device',
    method: 'post',
    data
  })
}

/**
 * 修改设备
 * @param {*} json格式参数
 */
export function updateDevice(data) {
  return request({
    url: '/sys/device',
    method: 'put',
    data
  })
}

/**
 * 删除设备
 * @param id 设备id数组格式
 */
export function deleteDevice(id) {
  return request({
    url: '/sys/device/' + id,
    method: 'delete'
  })
}

/**
 * 设备详情
 * @param id 设备id
 */
export function detailDevice(id) {
  return request({
    url: '/sys/device/' + id,
    method: 'get'
  })
}

/**
 * 获取部门树列表
 */
export function getDeptTree() {
  return request({
    url: '/sys/dept/tree',
    method: 'get'
  })
}

/**
 * 获取未绑定sim卡列表
 */
export function getUnbind(query) {
  return request({
    url: '/sim/record',
    method: 'get',
    params: query
  })
}

/**
 * 新增sim卡
 */
export function createSim(data) {
  return request({
    url: '/sim',
    method: 'post',
    data
  })
}

/**
 * 获取未绑定SIM卡列表
 */
export function getSimList(params) {
  return request({
    url: '/sim',
    method: 'get',
    params
  })
}

