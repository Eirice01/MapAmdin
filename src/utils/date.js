
import _ from 'lodash'
export function formatDate(date, fmt) {
  if (!_.isDate(date)) {
    date = new Date(date)
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
/**
 * 获取年的第N个季度的开始时间
 * @param {String} year
 * @param {Number} n
 * @param {String} fmt
 */
export function getQuarterStartMonth(year, n, fmt) {
  var quarterStartDate = new Date(year, getQuarterStartMonthByN(n), 1)
  return formatDate(quarterStartDate, fmt)
}

function getQuarterStartMonthByN(n) {
  var quarterStartMonth = 0
  switch (n) {
    case 1:
      quarterStartMonth = 0
      break
    case 2:
      quarterStartMonth = 3
      break
    case 3:
      quarterStartMonth = 6
      break
    case 4:
      quarterStartMonth = 9
      break
  }
  return quarterStartMonth
}
/**
 * 获取年的第N个季度的结束时间
 * @param {String} year
 * @param {Number} n
 * @param {String} fmt
 */
export function getQuarterEndMonth(year, n, fmt) {
  var quarterEndMonth = getQuarterStartMonthByN(n) + 2
  var quarterStartDate = new Date(year, quarterEndMonth, getMonthDays(year, quarterEndMonth))
  return formatDate(quarterStartDate, fmt)
}

// 获得某月的天数
function getMonthDays(y, m) {
  var monthStartDate = new Date(y, m, 1)
  var monthEndDate = new Date(y, m + 1, 1)
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  return days
}

/**
 * 将时长转换为时长字符串
 * @param {int} StatusMinute
 */
export function timeStamp(StatusMinute) {
  var day = parseInt(StatusMinute / 60 / 24)
  var hour = parseInt(StatusMinute / 60 % 24)
  var min = parseInt(StatusMinute % 60)
  StatusMinute = ''
  if (day > 0) {
    StatusMinute = day + '天'
  }
  if (hour > 0) {
    StatusMinute += hour + '小时'
  }
  if (min > 0) {
    StatusMinute += parseFloat(min) + '分钟'
  }
  return StatusMinute
}
/**
 * @description 格式化日期对象 到时分秒 00:00:00 或者 23:59:59 end为真格式化到23:59:59 否则00:00:00
 * add by lishibin 2018-11-24
 * @param {Date} date
 * @param {any} end
 */
export function initDate(date, end) {
  if (!_.isDate(date)) {
    date = new Date()
  }
  const tempDate = _.cloneDeep(date)
  tempDate.setHours(end ? 23 : 0)
  tempDate.setMinutes(end ? 59 : 0)
  tempDate.setSeconds(end ? 59 : 0)
  return formatDate(tempDate, 'yyyy-MM-dd hh:mm:ss')
}

export function getStartEnd() {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return [initDate(date), initDate(new Date(), true)]
}
