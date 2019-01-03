import request from '@/utils/request'
export function getCommandLog(query) {
  return request({
    url: '/sys/log/command',
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
    url: '/sys/log/command/excel',
    method: 'get',
    params: params
  })
}
