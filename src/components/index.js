import AlarmInfo from './VehicleDialog/AlarmInfo.vue'
import BatchHandle from './VehicleDialog/BatchHandle.vue'
import selectCarSingle from './SelectCar/selectCarSingle'
import selectCarDouble from './SelectCar/selectCarDouble'
import menuTypeTree from '@/components/menuTypeTree'
import charts from '@/components/Echarts/ECharts'
import reportFooter from '@/components/report/reportFooter'
import exportModular from '@/components/exportModular/exportModular'
import DataPickers from '@/components/DataPickers/DataPickers'
// 这里是重点
const comConpentes = {
  install: function(Vue) {
    Vue.component('AlarmInfo', AlarmInfo)
    Vue.component('BatchHandle', BatchHandle)
    Vue.component('selectCarSingle', selectCarSingle)
    Vue.component('selectCarDouble', selectCarDouble)
    Vue.component('menuTypeTree', menuTypeTree)
    Vue.component('charts', charts)
    Vue.component('reportFooter', reportFooter)
    Vue.component('exportModular', exportModular)
    Vue.component('DataPickers', DataPickers)
    // Vue.component('AlarmInfo', () => import('./VehicleDialog/AlarmInfo.vue'))
  }
}

// 导出组件
export default comConpentes
