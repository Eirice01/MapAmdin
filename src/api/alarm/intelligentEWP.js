// @Author: outman_qiaopeng  Date: 2018-09-12 14:44:24
import request from '@/utils/request'

/**
 * 预警列表查询
 */
export function fetchList(params) {
  return request({
    url: '/alarm/record',
    method: 'get',
    params
  })
}

/**
 * 获取预警类型
 */
export function getAlarmType() {
  return request({
    url: '/alarm/record/alarmtype',
    method: 'get'
  })
}

/**
 * 获取报警类型
 */
export function getCallAlarmType() {
  return request({
    url: '/alarm/record/callAlarmtype',
    method: 'get'
  })
}

export function getMsgList() {
  return request({
    url: '/alarm/record/contentModle',
    method: 'get'
  })
}

export function addMsg(data) {
  return request({
    url: '/alarm/record/contentModle',
    method: 'post',
    data
  })
}

export function deleteMsg(id) {
  return request({
    url: `/alarm/record/contentModle/${id}`,
    method: 'delete'
  })
}
