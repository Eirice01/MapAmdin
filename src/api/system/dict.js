// @Author: outman_qiaopeng  Date: 2018-09-11 18:17:25
import request from '@/utils/request'

/**
 * 字典列表
 */
export function fetchList() {
  return request({
    url: '/sys/dict',
    method: 'get'
  })
}

/**
 * 新增字典
 * @param {*} 表单数据
 */
export function createDict(data) {
  return request({
    url: '/sys/dict',
    method: 'post',
    data
  })
}

/**
 * 修改字典
 * @param {*} json格式参数
 */
export function updateDict(data) {
  return request({
    url: '/sys/dict',
    method: 'put',
    data
  })
}

/**
 * 删除字典
 * @param id 字典id
 */
export function deleteDict(id) {
  return request({
    url: '/sys/dict/' + id,
    method: 'delete'
  })
}

/**
 * 获取字典详情
 * @param {*} 字典id
 */
export function fetchDict(id) {
  return request({
    url: '/sys/dict/' + id,
    method: 'get'
  })
}
