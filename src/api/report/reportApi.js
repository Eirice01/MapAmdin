import request from '@/utils/request'

/**
 * 获取胎压类型
 * @param params
 */
export function getAlarmTyreTypes() {
  return request({
    url: '/statistics/tire/alarmTyreTypes',
    method: 'get'
  })
}

/**
 * 获取胎压统计
 * @param params
 */
export function getStatisticsList(params) {
  return request({
    url: '/statistics/tire',
    method: 'get',
    params
  })
}

/**
 * 获取胎压统计
 * @param params
 */
export function getStatisticsReport(params) {
  return request({
    url: '/statistics/tire/report',
    method: 'get',
    params
  })
}

/**
 * 获取预警类型
 */
export function getWarningTypes() {
  return request({
    url: '/alarm/record/alarmtype',
    method: 'get'
  })
}

/**
 * 获取预警智能对比列表
 * @param {*} data
 */
export function getWarningContrastList(data) {
  return request({
    url: '/alarmCensus/contrast',
    method: 'post',
    data
  })
}
/**
 * 车辆智能预警明细
 * @param {*} query
 */
export function getWarningDetailList(query) {
  return request({
    url: '/alarmCensus/alarmDetail',
    method: 'get',
    params: query
  })
}

/**
 * 获取车辆预警趋势数据
 * @param {*} query
 */
export function getTendency(query) {
  return request({
    url: '/alarmCensus/tendency',
    method: 'get',
    params: query
  })
}

/**
 * 获取车辆减排量统计
 * @param {*} query
 */
export function getStatisticsEnergy(query) {
  return request({
    url: '/start/mileage/release',
    method: 'get',
    params: query
  })
}

/**
 * 车辆上线率统计接口
 * @param {*} query
 */
export function getStatisticsOnline(query) {
  return request({
    url: '/start/mileage/vehicleOnline',
    method: 'get',
    params: query
  })
}

/**
 * 获取车辆预警类型分布图表数据
 * @param {*} query
 */
export function getDistribute(query) {
  return request({
    url: '/alarmCensus/distribute',
    method: 'get',
    params: query
  })
}
/**
 * 灭火装置异常列表
 */
export function getFireStatisticsList(params) {
  return request({
    url: '/statistics/fire',
    method: 'get',
    params
  })
}
/**
 * 灭火装置异常列表导出
 */
export function getFireStatisticsExport(params) {
  return request({
    responseType: 'blob',
    url: '/statistics/fire/excel',
    method: 'get',
    params
  })
}
/**
 * 灭火装置异常数据统计
 */
export function getFireStatisticsReport(params) {
  return request({
    url: '/statistics/fire/report',
    method: 'get',
    params
  })
}
/**
 * 灭火装置异常预警类型
 */
export function getFireStatisticsType() {
  return request({
    url: '/statistics/fire/alarmFireTypes',
    method: 'get'
  })
}
/**
 * 车辆客流数据列表
 */
export function getVehicleStatisticsList(params) {
  return request({
    url: '/statistics/passenger/list',
    method: 'get',
    params
  })
}
/**
 * 车辆客流数据统计
 */
export function getVehicleStatisticsReport(params) {
  return request({
    url: '/statistics/passenger/report',
    method: 'get',
    params
  })
}
/**
 * 线路客流数据列表
 */
export function getRouteList(params) {
  return request({
    url: '/statistics/passenger/lineList',
    method: 'get',
    params
  })
}
/**
 * 线路客流数据统计
 */
export function getRouteReport(params) {
  return request({
    url: '/statistics/passenger/lineReport',
    method: 'get',
    params
  })
}

/**
 * 报警类型接口
 */
export function getCallAlarmtype(params) {
  return request({
    url: '/alarm/record/callAlarmtype',
    method: 'get',
    params
  })
}

/**
 * 车辆报警处理报告列表
 */
export function getStatistical(params) {
  return request({
    url: '/statistical',
    method: 'get',
    params: params
  })
}
/**
 * 车辆报警处理报告统计图
 */
export function getStatisticalCharts(params) {
  return request({
    url: '/statistical/result',
    method: 'get',
    params: params
  })
}

/**
 * 里程列表
 */
export function getMileage(params) {
  return request({
    url: '/start/mileage/mileage',
    method: 'get',
    params: params
  })
}

/**
 * 里程统计图
 */
export function getMileageCharts(params) {
  return request({
    url: '/start/mileage/mileageInterface',
    method: 'get',
    params: params
  })
}

/**
 * 超速统计列表
 */
export function getOverspeed(params) {
  return request({
    url: '/statistical/overspeed',
    method: 'get',
    params: params
  })
}

/**
 * 超速统计图
 */
export function getOverspeedCharts(params) {
  return request({
    url: '/statistical/overspeed/result',
    method: 'get',
    params: params
  })
}

/**
 * 超速统计列表
 */
export function getVehicleOnOff(params) {
  return request({
    url: '/start/mileage/vehicleOnOff',
    method: 'get',
    params: params
  })
}

/**
 * 超速统计图
 */
export function getVehicleOnOffCharts(params) {
  return request({
    url: '/start/mileage/vehicleOnOffInterface',
    method: 'get',
    params: params
  })
}

/**
 * 车辆上线率统计接口列表
 */
export function getVehicleOnline(params) {
  return request({
    url: '/start/mileage/vehicleOnline',
    method: 'get',
    params: params
  })
}

/**
 * 车辆上线率统计接口统计图
 */
export function getVehicleOnlineCharts(params) {
  return request({
    url: '/start/mileage/vehicleOnlineInterface',
    method: 'get',
    params: params
  })
}

/**
 * 新能源减排量列表
 */
export function getVehicleRelease(params) {
  return request({
    url: '/start/mileage/release',
    method: 'get',
    params: params
  })
}

/**
 * 新能源减排量统计图
 */
export function getVehicleReleaseCharts(params) {
  return request({
    url: '/start/mileage/releaseInterface',
    method: 'get',
    params: params
  })
}

/**
 * 电子围栏报警统计列表
 */
export function getAence(params) {
  return request({
    url: '/statistics/aence',
    method: 'get',
    params: params
  })
}

/**
 * 电子围栏报警统计图形报表
 */
export function getAenceCharts(params) {
  return request({
    url: '/statistics/aence/report',
    method: 'get',
    params: params
  })
}

/**
 * 故障报警统计
 */
export function getFault(params) {
  return request({
    url: '/statistics/fault',
    method: 'get',
    params: params
  })
}

/**
 * 故障报警统计图形报表
 */
export function getFaultCharts(params) {
  return request({
    url: '/statistics/fault/report',
    method: 'get',
    params: params
  })
}

/**
 * 电池报警报告列表
 */
export function getBattery(params) {
  return request({
    url: '/statistical/battery',
    method: 'get',
    params: params
  })
}

/**
 * 电池报警报告（统计图）
 */
export function getBatteryCharts(params) {
  return request({
    url: '/statistical/battery/result',
    method: 'get',
    params: params
  })
}

/**
 * ADAS预警处理统计
 */
export function getAdas(params) {
  return request({
    url: '/statistics/adas',
    method: 'get',
    params: params
  })
}

/**
 * ADAS预警处理统计（统计图）
 */
export function getAdasCharts(params) {
  return request({
    url: '/statistics/adas/report',
    method: 'get',
    params: params
  })
}

/**
 * 获取电池报警类型
 */
export function getBatteryAlarmTypes(params) {
  return request({
    url: '/statistical/battery/alarmTypes',
    method: 'get',
    params: params
  })
}
