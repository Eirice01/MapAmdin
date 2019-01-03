import request from '@/utils/request'

/**
 * 分页获取角色列表
 * @param {*} query 查询参数，json格式
 */
export function fetchRoleList(query) {
  return request({
    url: '/sys/role',
    method: 'get',
    params: query
  })
}

/**
 * 获取所有角色
 */
export function fetchAllRole() {
  return request({
    url: '/sys/role/all',
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/sys/menu/tree',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: '/sys/role',
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

export function exportRole(id) {
  return request({
    url: '/sys/role/excel',
    method: 'get'
  })
}
