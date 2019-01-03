<template>
  <el-date-picker
    v-model.trim="startEnd"
    type="datetimerange"
    :clearable="false"
    :default-time="defaultTime"
    :picker-options="pickerOptions"
    range-separator="——"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    size="small"
    format="yyyy-MM-dd HH:mm:ss"
    value-format="yyyy-MM-dd HH:mm:ss">
  </el-date-picker>

</template>

<script>
  import { initDate } from '@/utils/date'
  export default {
    name: 'DataPickers',
    data() {
      return {
        defaultTime: ['00:00:00', '23:59:59'],
        startEnd: [initDate(), initDate(new Date(), true)],
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
                picker.$emit('pick', [initDate(date), initDate(dataEnd, true)])
              }
            },
            {
              text: '最近7天',
              onClick(picker) {
                const date = new Date()
                date.setDate(date.getDate() - 7)
                const dataEnd = new Date()
                dataEnd.setDate(dataEnd.getDate() - 1)
                picker.$emit('pick', [initDate(date), initDate(dataEnd, true)])
              }
            },
            {
              text: '最近1月',
              onClick(picker) {
                const date = new Date()
                date.setMonth(date.getMonth() - 1)
                const dataEnd = new Date()
                dataEnd.setDate(dataEnd.getDate() - 1)
                picker.$emit('pick', [initDate(date), initDate(dataEnd, true)])
              }
            }
          ]
        }
      }
    },
    watch: {
      startEnd(arr) {
        this.$emit('startEnd', arr)
      }
    },
    methods: {
      resetDate() {
        const date = new Date()
        date.setDate(date.getDate() - 7)
        const dataEnd = new Date()
        dataEnd.setDate(dataEnd.getDate() - 1)
        this.startEnd = [initDate(date), initDate(dataEnd, true)]
        this.$emit('startEnd', this.startEnd)
      }
    },
    created() {
      this.resetDate()
    }
  }
</script>

<style scoped>

</style>
