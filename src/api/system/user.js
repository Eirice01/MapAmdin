import request from '@/utils/request'

/**
 * 分页获取用户列表
 * @param {*} 查询参数，json格式
 */
export function fetchList(query) {
  return request({
    url: '/sys/user',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户详情
 * @param {*} 用户id
 */
export function fetchUser(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'get'
  })
}

export function updatePwd(data) {
  return request({
    url: '/sys/user/updatePwd',
    method: 'put',
    data
  })
}

/**
 * 新增用户
 * @param {*} 表单数据
 */
export function createUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/**
 * 修改用户信息
 * @param {*} json格式参数
 */
export function updateUser(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {*} userIds 数组格式
 */
export function deleteUser(userIds) {
  return request({
    url: '/sys/user/' + userIds.join(),
    method: 'delete'
  })
}

export function exportUser() {
  return request({
    url: '/sys/user/excel',
    method: 'get'
  })
}

export function getAllotlist(params) {
  return request({
    url: '/base/platform/permslistAll',
    method: 'get',
    params
  })
}

export function allot(data) {
  return request({
    url: '/base/user/permPlatform',
    method: 'put',
    data
  })
}

export function getDeptTree() {
  return request({
    url: '/sys/dept/tree',
    method: 'get'
  })
}

export function getCarByUser(params) {
  return request({
    url: '/base/vehicle/perms',
    method: 'get',
    params
  })
}

export function allotCar(data) {
  return request({
    url: '/base/vehicle/perms',
    method: 'post',
    data
  })
}
