// @Author: outman_qiaopeng  Date: 2018-09-18 16:09:19
import request from '@/utils/request'

/**
 * 企业列表
 */
export function owersList(query) {
  return request({
    url: '/base/owers',
    method: 'get',
    params: query
  })
}

/**
 * 根据下级平台查询业户列表
 */
export function owersListByPlatform(platformId) {
  return request({
    url: '/base/owers/byPlatform/' + platformId,
    method: 'get'
  })
}
