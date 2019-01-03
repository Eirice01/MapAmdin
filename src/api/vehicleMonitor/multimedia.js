import request from '@/utils/request'
/**
 * 多媒体监控列表
 */
export function getMediaList(params) {
  return request({
    url: '/media/multimedia',
    method: 'get',
    params
  })
}
/**
 * 多媒体监控操作记录列表
 */
export function getMediaRecordList(id, params) {
  return request({
    url: '/media/multimedia/snap/' + id,
    method: 'get',
    params
  })
}
/**
 * 多媒体监控操作记录列表导出
 */
export function getMediaRecordExport(id) {
  return request({
    responseType: 'blob',
    url: '/media/multimedia/snapExport/' + id,
    method: 'get'
  })
}
