<template>
  <el-tree ref="menu" :data="treeMenuData" :default-checked-keys="checkedKeys" show-checkbox default-expand-all node-key="code" highlight-current :props="treeMenuProp" :expand-on-click-node="false" @check-change="handleCheckChange"></el-tree>
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
  },
  methods: {
    handleCheckChange() {
      const tmp = this.$refs.menu.getCheckedNodes().filter(item => {
        if (item.code > 10) {
          return item
        }
      })
      this.$emit('check-change', tmp)
    }
  }
}
</script>

