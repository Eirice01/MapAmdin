// @Author: outman_qiaopeng  Date: 2018-09-18 16:56:31
import request from '@/utils/request'

/**
 * 平台接入列表
 */
export function fetchList(query) {
  return request({
    url: '/base/platform',
    method: 'get',
    params: query
  })
}

/**
 * 新增平台接入
 * @param {*} 表单数据
 */
export function createPlatform(data) {
  return request({
    url: '/base/platform',
    method: 'post',
    data
  })
}

/**
 * 修改平台接入
 * @param {*} json格式参数
 */
export function updatePlatform(data) {
  return request({
    url: '/base/platform',
    method: 'put',
    data
  })
}

// /**
//  * 删除平台接入
//  * @param id 平台接入id数组格式
//  */
// export function deletePlatform(id) {
//   return request({
//     url: '/base/platform/' + id.join(),
//     method: 'delete'
//   })
// }

/**
 * 删除平台接入
 * @param id 平台接入id数组格式
 */
export function deletePlatform(id) {
  return request({
    url: '/base/platform/' + id,
    method: 'delete'
  })
}

/**
 * 平台接入详情
 * @param id 平台接入id
 */
export function detailPlatform(id) {
  return request({
    url: '/base/platform/' + id,
    method: 'get'
  })
}

/**
 * 已分配下级平台下拉框列表
 * @param
 */
export function getPermsList() {
  return request({
    url: '/base/platform/permslist',
    method: 'get'
  })
}

/**
 * 用户分配下级平台列表
 * @param query
 */
export function getAllowList(query) {
  return request({
    url: '/base/platform/allotlist',
    method: 'get',
    params: query
  })
}

/**
 * 返回唯一自增数字
 * @param query
 */
export function getOnlyNum() {
  return request({
    url: '/base/platform/onlyNumber',
    method: 'get'
  })
}

