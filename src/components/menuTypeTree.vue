<template>
  <el-tree ref="menu" :data="treeMenuData" :default-checked-keys="checkedKeys" :selectedAll="selectedAll" show-checkbox default-expand-all node-key="code" highlight-current :props="treeMenuProp" :expand-on-click-node="false" @check-change="handleCheckChange"></el-tree>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-12 20:01:39
import _ from 'lodash'
export default {
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
    },
    selectedAll: {
      type: Boolean,
      required: false
    }
  },
  async mounted() {
    // this.data = this.treeMenuData
    // this.props = this.treeMenuProp
    // 如果 selectedAll 为true则选中所有的元素  在组件执行完vm.$mount(el),之后才可去调用setChecked方法
    var the = this
    if (the.selectedAll) {
      _.forEach(the.treeMenuData, function(v, i) {
        the.$refs.menu.setChecked(v, true, true)
      })
    }
  },
  methods: {
    handleCheckChange() {
      const tmp = this.$refs.menu.getCheckedNodes().filter(item => {
        if (item.code > 10) {
          return item
        }
      })
      this.$emit('check-change', tmp)
    },
    // 选中所有节点方法
    selectAll() {
      const the = this
      _.forEach(the.treeMenuData, function(v, i) {
        the.$refs.menu.setChecked(v, true, true)
      })
    }
  }
}
</script>

