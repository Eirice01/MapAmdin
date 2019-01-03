import request from '@/utils/request'
export function getOperationLog(query) {
  return request({
    url: '/sys/log/operate',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query
 */
export function exportExcel(params) {
  return request({
    responseType: 'blob',
    url: '/sys/log/operate/excel',
    method: 'get',
    params: params
  })
}
