<template>
  <el-tree :data="treeMenuData" :default-checked-keys="checkedKeys" show-checkbox default-expand-all node-key="id" highlight-current :props="treeMenuProp"></el-tree>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-12 20:01:39
export default {
  name: 'menuTree',
  props: {
    treeMenuData: {
      type: Array,
      default: [],
      required: true
    },
    treeMenuProp: {
      type: Object,
      required: true
    },
    checkedKeys: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.data = this.treeMenuData
    this.props = this.treeMenuProp
  }
}
</script>

