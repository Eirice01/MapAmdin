/*
 * @Author: outman_qiaopeng
 * @Date: 2018-09-11 11:14:08
 */
import request from '@/utils/request'

/**
 * 菜单列表
 */
export function fetchList() {
  return request({
    url: '/sys/menu/all',
    method: 'get'
  })
}

/**
 * 新增菜单
 * @param {*} 表单数据
 */
export function createMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data
  })
}

/**
 * 修改菜单
 * @param {*} json格式参数
 */
export function updateMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'put',
    data
  })
}

/**
 * 删除菜单
 * @param {*} json格式参数
 */
export function deleteMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'delete',
    data
  })
}

/**
 * 获取菜单详情
 * @param {*} 菜单id
 */
export function fetchMenu(id) {
  return request({
    url: '/sys/menu/' + id,
    method: 'get'
  })
}

/**
 * 获取菜单树
 */
export function fetchMenuTree() {
  return request({
    url: '/sys/menu/tree',
    method: 'get'
  })
}

/**
 * 菜单树修改
 * @param {*} 菜单id
 */
export function updateMenuTree(id) {
  return request({
    url: '/sys/menu/' + id,
    method: 'get'
  })
}
