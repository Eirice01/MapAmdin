import request from '@/utils/request'

/**
 * 分页获取机构列表
 * @param {*} query 查询参数，json格式
 */
export function fetchList(query) {
  return request({
    url: '/sys/dept',
    method: 'get',
    params: query
  })
}

/**
 * 获取部门树
 * @param {*} query json格式查询条件
 */
export function deptTree(query) {
  return request({
    url: '/sys/dept/tree',
    method: 'get',
    params: query
  })
}

