<template>
  <div class="app-container">
    <el-header>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate()">新增</el-button>
    </el-header>

    <tree-table :data="data" :columns="columns" border v-loading.body="listLoading">
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button circle type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button circle type="primary" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="添加下级" placement="top">
            <el-button circle type="primary" size="small" icon="el-icon-plus" @click="handleCreate(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" ref="dataForm" :model="sysMenu" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="上级菜单" prop="parentName">
          <el-input v-model="sysMenu.parentName" disabled></el-input>
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio v-model="sysMenu.type" label="0">目录</el-radio>
          <el-radio v-model="sysMenu.type" label="1">菜单</el-radio>
          <el-radio v-model="sysMenu.type" label="2">按钮</el-radio>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name" v-if="dialogStatus=='create'">
          <el-input v-model="sysMenu.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>

        <el-form-item label="链接地址" prop="url">
          <el-input v-model="sysMenu.url" placeholder="请输入链接地址"></el-input>
        </el-form-item>

        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="sysMenu.perms" placeholder="权限标识"></el-input>
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="sysMenu.orderNum" placeholder="排序号"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="handleConfirm">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-11 11:30:30
import { fetchList, createMenu, updateMenu, deleteMenu, fetchMenu } from '@/api/infomationM/menu'
import treeTable from '@/components/TreeTable'
export default {
  name: 'menuList',
  components: { treeTable },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑菜单',
        create: '新增菜单'
      },
      listLoading: false,
      sysMenu: {
        parentId: '',
        parentName: '',
        menuId: '',
        name: '',
        type: '',
        typeName: '',
        url: '',
        perms: '',
        orderNum: ''
      },
      rules: { // 表单验证规则
        name: [{ required: true, message: '菜单名称是必填项', trigger: 'blur' }],
        type: [{ required: true, message: '菜单类型是必选项', trigger: 'blur' }],
        orderNum: [{ required: true, message: '排序号是必填项', trigger: 'blur' }]
      },
      data: [],
      columns: [
        {
          text: '菜单ID',
          value: 'id',
          width: 80
        },
        {
          text: '菜单名称',
          value: 'name',
          width: 200
        },
        {
          text: '菜单url',
          value: 'url'
        },
        {
          text: '菜单类型',
          value: 'typeName',
          width: 100
        },
        {
          text: '权限标识',
          value: 'perms'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() { // 获取菜单列表
      this.listLoading = true
      fetchList().then((response) => {
        this.data = response.data.children
        this.listLoading = false
      })
    },
    getMenuDetail(menuId) { // 获取单个菜单详情信息
      fetchMenu(menuId).then(response => {
        const temp = response.data
        switch (temp.type) {
          case 0:
            temp.typeName = '目录'
            break
          case 1:
            temp.typeName = '菜单'
            break
          case 2:
            temp.typeName = '按钮'
            break
          default:
            break
        }
        this.sysMenu.parentId = temp.parentId
        this.sysMenu.parentName = temp.parentName
        this.sysMenu.menuId = temp.menuId
        this.sysMenu.name = temp.name
        this.sysMenu.typeName = temp.typeName
        this.sysMenu.type = temp.type + ''
        this.sysMenu.url = temp.url
        this.sysMenu.perms = temp.perms
        this.sysMenu.orderNum = temp.orderNum
      })
    },
    handleCreate(row) { // 打开新增菜单dialog
      if (row) { // 如果当前menuId存在，则创建当前菜单子菜单
        if (row.type === '2' || row.type === 2) {
          this.$message({
            message: '按钮不能添加子菜单',
            type: 'info'
          })
          return
        } else {
          this.sysMenu = {
            parentId: row.id,
            parentName: row.name,
            menuId: '',
            name: '',
            type: '',
            url: '',
            perms: '',
            orderNum: ''
          }
        }
      } else { // 不存在则创建根目录菜单
        this.sysMenu = {
          parentId: '0',
          parentName: '根目录',
          menuId: '',
          name: '',
          type: '',
          url: '',
          perms: '',
          orderNum: ''
        }
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleConfirm() { // 新增菜单提交
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMenu(this.sysMenu).then((response) => {
            if (response.code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    resetForm() { // 重置表单
      this.sysMenu = {
        parentId: '',
        parentName: '',
        menuId: '',
        name: '',
        type: '',
        typeName: '',
        url: '',
        perms: '',
        orderNum: ''
      }
    },
    handleUpdate(row) {
      if (row.parentId === '0' || row.parentId === 0) {
        this.$message({
          message: '根目录下的菜单或者目录不能修改',
          type: 'info'
        })
      } else {
        this.resetForm()
        this.getMenuDetail(row.id)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    updateData() { // 修改菜单提交
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.sysMenu)
          updateMenu(tempData).then((response) => {
            if (response.code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将删除菜单信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
