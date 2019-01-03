// @Author: outman_qiaopeng  Date: 2018-09-18 16:53:14
import request from '@/utils/request'

/**
 * 驾驶员列表
 */
export function fetchList(query) {
  return request({
    url: '/base/driver',
    method: 'get',
    params: query
  })
}

/**
 * 新增驾驶员
 * @param {*} 表单数据
 */
export function createDriver(data) {
  return request({
    url: '/base/driver',
    method: 'post',
    data
  })
}

/**
 * 修改驾驶员
 * @param {*} json格式参数
 */
export function updateDriver(data) {
  return request({
    url: '/base/driver',
    method: 'put',
    data
  })
}

/**
 * 删除驾驶员
 * @param id 驾驶员id数组格式
 */
export function deleteDriver(id) {
  return request({
    url: '/base/driver/' + id.join(),
    method: 'delete'
  })
}

/**
 * 驾驶员详情
 * @param id 驾驶员id
 */
export function detailDriver(id) {
  return request({
    url: '/base/driver/' + id,
    method: 'get'
  })
}

