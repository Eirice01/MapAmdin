<template>
  <el-button @click="exportChecked"  type="primary" size="mini">{{buttonName}}</el-button>
</template>

<script>
  import request from '@/utils/request'
  export default {
    name: 'exportModular',
    props: {
      url: {
        type: String,
        default: '/alarm/record/download'
      },
      method: {
        type: String,
        default: 'GET'
      },
      responseType: {
        type: String,
        default: 'blob'
      },
      parameter: '',
      fileName: {
        type: String,
        default: '泉州平台'
      },
      buttonName: {
        type: String,
        default: '导出'
      }
    },
    methods: {
      // 导出
      exportChecked() {
        this.$emit('down')
        const param = {
          url: this.url,
          method: this.method,
          data: this.parameter,
          responseType: this.responseType
        }
        this.exportAjax(param).then((res) => {
          this.downloads(res)
        }).catch((res) => {
          console.log(res.type)
          this.downloads(res)
        })
      },

      downloads(data) {
        if (!data) {
          return
        }
        const url = window.URL.createObjectURL(new Blob([data]), { type: data.type })
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.parameter.currentDate + '.zip')
        document.body.appendChild(link)
        link.click()
      },

      exportAjax(params) {
        return request({
          responseType: params.responseType,
          url: params.url,
          method: params.method,
          params: params.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
