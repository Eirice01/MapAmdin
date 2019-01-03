import request from '@/utils/request'

export function getDeptList(param) {
  const data = {
    deptName: param.deptName,
    page: param.page,
    limit: param.limit
  }
  return request({
    url: `/sys/dept`,
    method: 'get',
    params: data
  })
}

export function getDeptTree() {
  return request({
    url: '/sys/dept/tree',
    method: 'get'
  })
}
export function addDept(data) {
  return request({
    url: '/sys/dept',
    method: 'post',
    data
  })
}
export function getDeptById(id) {
  return request({
    url: `/sys/dept/${id}`,
    method: 'get'
  })
}
export function updateDept(data) {
  return request({
    url: '/sys/dept',
    method: 'put',
    data
  })
}

export function deleteDept(id) {
  return request({
    url: `/sys/dept/${id}`,
    method: 'DELETE'
  })
}

export function getDownMenu(param) {
  return request({
    url: `/sys/dict/downMenu/${param.type}`,
    method: 'GET'
  })
}
