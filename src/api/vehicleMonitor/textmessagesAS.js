import request from '@/utils/request'
/**
 * 文本信息下发列表
 */
export function getTextMessageList(params) {
  return request({
    url: '/textSend',
    method: 'get',
    params
  })
}
/**
 * 文本信息操作记录列表
 */
export function getTextRecordList(params) {
  return request({
    url: '/textSend/history',
    method: 'get',
    params
  })
}
/**
 * 文本信息操作记录列表导出
 */
export function textRecordExport(params) {
  return request({
    responseType: 'blob',
    url: '/textSend/history/excel',
    method: 'get',
    params: params
  })
}

/**
 * 文本信息操作记录批量删除
 * data:id数组
 */
export function deleteTextRecord(data) {
  return request({
    url: '/textSend/history' + data,
    method: 'delete'
  })
}
/**
 * 文本信息下发-->添加消息模板数据
 */
export function createTextMsg(data) {
  return request({
    url: '/textSend/modle/save',
    method: 'post',
    data
  })
}
/**
 * 文本信息下发-->获取消息模板列表
 */
export function getTextMsg() {
  return request({
    url: '/textSend/modle',
    method: 'get'
  })
}
/**
 * 文本信息下发-->删除消息模板数据
 */
export function deleteTextMsg(data) {
  return request({
    url: '/textSend/modle/' + data,
    method: 'delete'
  })
}

/**
 * 报警类型信息详情
 */
export function getRecordInfoById(id) {
  return request({
    url: '/alarm/record/info/' + id,
    method: 'GET'
  })
}
