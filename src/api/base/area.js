// @Author: outman_qiaopeng  Date: 2018-09-19 18:02:05
import request from '@/utils/request'

/**
 * 根据行政区划代码查询下级列表
 * @param id 行政区id
 */
export function getAreaList(id) {
  return request({
    url: '/base/area/' + id,
    method: 'get'
  })
}
