import request from '@/utils/request'
/**
 *
 * @param {*} query
 */
export function getLoginLog(query) {
  return request({
    url: '/sys/log/login',
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
    url: '/sys/log/login/excel',
    method: 'get',
    params: params
  })
}

