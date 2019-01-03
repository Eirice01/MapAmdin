<template>
  <div>
    <el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree show-checkbox :data="treeData" :props="defaultProps" ref="tree" node-key="id" @node-click="handleNodeClick" :filter-node-method="filterNode" :highlight-current="true" :default-expand-all="true" style="height: 500px;padding-bottom:30px;overflow: auto"></el-tree>
  </div>
</template>

<script>
import { deptTree } from '@/api/system/dept'

export default {
  name: 'deptTree',
  data() {
    return {
      filterText: '',
      list: null,
      total: 0,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      treeData: [
      ],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadTree()
  },
  methods: {
    loadTree() { // 加载部门树
      deptTree(this.listQuery).then(response => {
        this.treeData = [response.data]
      })
    },
    handleNodeClick(data) {
      // 触发父组件nodeClick方法
      this.$emit('nodeClick', data)
      this.getSelectNode()
    },
    filterNode(value, data) { // 树节点过滤方法
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    getSelectNode() { // 获取选中的节点
      return this.$refs.tree.getCurrentNode()
    }
  }
}
</script>
