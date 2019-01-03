
import _ from 'lodash'
import { initDate } from '@/utils/date'
export default {
  data() {
    return {
      listLoading: false,
      // 选择时间插件开始
      startEnd: [],
      dialogTitle: '',
      isAalarm: false,
      recordId: '',
      dateTimeFormat: 'yyyy-MM-dd hh:mm:ss',
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [initDate(), initDate(new Date(), true)])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const yesterday = new Date()
              yesterday.setDate(yesterday.getDate() - 1)
              picker.$emit('pick', [initDate(yesterday), initDate(yesterday, true)])
            }
          },
          {
            text: '最近3天',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() - 3)
              const dataEnd = new Date()
              dataEnd.setDate(dataEnd.getDate() - 1)
              console.log(dataEnd)
              picker.$emit('pick', [initDate(date), initDate(dataEnd, true)])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() - 7)
              picker.$emit('pick', [initDate(date), initDate(new Date(), true)])
            }
          },
          {
            text: '最近1月',
            onClick(picker) {
              const date = new Date()
              date.setMonth(date.getMonth() - 1)
              picker.$emit('pick', [initDate(date), initDate(new Date(), true)])
            }
          }
        ]
      }
      // 选择时间插件结束
    }
  },
  methods: {
    handlerTypeformatter(n) {
      switch (n) {
        case 0:
          return '未处理'
        case 1:
          return '电话通知'
        case 2:
          return '建议停车'
        case 3:
          return '警告提醒'
        case 4:
          return '停车休息'
        case 5:
          return '语音下发'
        case 6:
          return '其他'
        default:
          return '出错啦'
      }
    },
    // 点击查看详情
    handleDetail(row) { // 预警详情
      this.recordId = _.get(row, 'id')
      const the = this
      if (!_.isEmpty(the.recordId)) {
        // this.$store.commit('SHOW_ALARM', true)
        this.dialogTitle = _.get(row, 'plateNo')
        this.isAalarm = true
      }
    },
    closeAlarm() {
      this.isAalarm = false
    },
    checkStartEnd(arr) {
      if (arr) {
        this.listQuery.startTime = arr[0]
        this.listQuery.endTime = arr[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    },
    checkDate(arr) {
      if (arr) {
        this.tableQuery.startTime = arr[0]
        this.tableQuery.endTime = arr[1]
        this.chartQuery.startTime = arr[0]
        this.chartQuery.endTime = arr[1]
      } else {
        this.tableQuery.startTime = ''
        this.tableQuery.endTime = ''
        this.chartQuery.startTime = ''
        this.chartQuery.endTime = ''
      }
    }

  },
  // 设置日期选择插件默认值 add by lishibin 2018-11-14
  created() {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    this.startEnd = [initDate(date), initDate(new Date(), true)]
  }
}
