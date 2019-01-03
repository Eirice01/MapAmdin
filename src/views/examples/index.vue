<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
          <router-link to="/demo/guide"><el-button type="primary">引导页</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/tinymce"><el-button type="success">富文本编辑器</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/json-editor"><el-button type="info">JSON编辑器</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/markdown"><el-button type="primary">Markdown编辑器</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/avatar-upload"><el-button type="info">头像上传</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/dropzone"><el-button type="success">Dropzone上传</el-button></router-link>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <router-link to="/demo/drag-dialog"><el-button type="primary">拖拽 Dialog</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/dnd-list"><el-button type="success">列表拖拽</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/drag-kanban"><el-button type="info">可拖拽看板</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/count-to"><el-button type="primary">CountTo</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/back-to-top"><el-button type="info">返回顶部</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/sticky"><el-button type="success">Sticky</el-button></router-link>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <router-link to="/demo/icon"><el-button type="primary">图标</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/line"><el-button type="success">折线图</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/mixchart"><el-button type="info">混合图表</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/export-excel"><el-button type="primary">Export Excel</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/export-selected-excel"><el-button type="info">Export Selected</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/upload-excel"><el-button type="success">Upload Excel</el-button></router-link>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <router-link to="/demo/download"><el-button type="primary">Export Zip</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/theme"><el-button type="success">换肤</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/dynamic-table"><el-button type="info">动态Table</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/drag-table"><el-button type="primary">拖拽Table</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/inline-edit-table"><el-button type="info">Table内编辑</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/tree-table"><el-button type="success">树形表格</el-button></router-link>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <router-link to="/demo/custom-tree-table"><el-button type="primary">自定义树表</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/complex-table"><el-button type="success">综合Table</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/clipboard"><el-button type="info">clipboard</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/page"><el-button type="primary">页面权限</el-button></router-link>
      </el-col>

      <el-col :span="4">
        <router-link to="/demo/directive"><el-button type="info">指令权限</el-button></router-link>
      </el-col>

      <!-- <el-col :span="4">
        <router-link to="/demo/list"><el-button type="success">综合实例</el-button></router-link>
      </el-col> -->
    </el-row>
  </div>
</template>
<style>
.el-row{
      margin-bottom: 10px;
}
</style>

<script>
import { fetchList } from '@/api/examples/article'

export default {
  name: 'exportZip',
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
        const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        zip.export_txt_to_zip(tHeader, data, this.filename, this.filename)
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
