import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set aislwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name  used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/specialMonitor', component: () => import('@/views/specialMonitor/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      alwaysShow: true,
      name: 'dashboard',
      meta: { title: '运营仪表盘', noCache: false }
    }]
  }
  // {
  //   path: '/demo',
  //   component: Layout,
  //   redirect: '/demo/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/examples/index'),
  //     name: 'widgetdemo',
  //     meta: { title: '组件demo', icon: 'example', noCache: true }
  //   },
  //   { path: 'guide', component: () => import('@/views/examples/guide/index'), meta: { title: '引导页', icon: 'guide', noCache: true }, hidden: true },
  //   { path: 'tinymce', component: () => import('@/views/examples/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: '富文本编辑器' }, hidden: true },
  //   { path: 'markdown', component: () => import('@/views/examples/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'Markdown编辑器' }, hidden: true },
  //   { path: 'json-editor', component: () => import('@/views/examples/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'JSON编辑器' }, hidden: true },
  //   { path: 'splitpane', component: () => import('@/views/examples/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }, hidden: true },
  //   { path: 'avatar-upload', component: () => import('@/views/examples/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: '头像上传' }, hidden: true },
  //   { path: 'dropzone', component: () => import('@/views/examples/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'Dropzone上传' }, hidden: true },
  //   { path: 'sticky', component: () => import('@/views/examples/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }, hidden: true },
  //   { path: 'count-to', component: () => import('@/views/examples/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }, hidden: true },
  //   { path: 'mixin', component: () => import('@/views/examples/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }, hidden: true },
  //   { path: 'back-to-top', component: () => import('@/views/examples/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: '返回顶部' }, hidden: true },
  //   { path: 'drag-dialog', component: () => import('@/views/examples/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: '拖拽 Dialog' }, hidden: true },
  //   { path: 'dnd-list', component: () => import('@/views/examples/components-demo/dndList'), name: 'dndList-demo', meta: { title: '列表拖拽' }, hidden: true },
  //   { path: 'drag-kanban', component: () => import('@/views/examples/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: '可拖拽看板' }, hidden: true },
  //   { path: 'icon', component: () => import('@/views/examples/svg-icons/index'), name: 'icons', meta: { title: '图标', icon: 'icon', noCache: true }, hidden: true },
  //   { path: 'keyboard', component: () => import('@/views/examples/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }, hidden: true },
  //   { path: 'line', component: () => import('@/views/examples/charts/line'), name: 'lineChart', meta: { title: '混合图表', noCache: true }, hidden: true },
  //   { path: 'mixchart', component: () => import('@/views/examples/charts/mixChart'), name: 'mixChart', meta: { title: '混合图表', noCache: true }, hidden: true },
  //   { path: 'dynamic-table', component: () => import('@/views/examples/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: '动态Table' }, hidden: true },
  //   { path: 'drag-table', component: () => import('@/views/examples/table/dragTable'), name: 'dragTable', meta: { title: '拖拽Table' }, hidden: true },
  //   { path: 'inline-edit-table', component: () => import('@/views/examples/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'Table内编辑' }, hidden: true },
  //   { path: 'tree-table', component: () => import('@/views/examples/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: '树形表格' }, hidden: true },
  //   { path: 'custom-tree-table', component: () => import('@/views/examples/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: '自定义树表' }, hidden: true },
  //   { path: 'complex-table', component: () => import('@/views/examples/table/complexTable'), name: 'complexTable', meta: { title: '综合Table' }, hidden: true },
  //   { path: 'export-excel', component: () => import('@/views/examples/excel/exportExcel'), name: 'exportExcel', meta: { title: '导出Excel' }, hidden: true },
  //   { path: 'export-selected-excel', component: () => import('@/views/examples/excel/selectExcel'), name: 'selectExcel', meta: { title: '导出选择项' }, hidden: true },
  //   { path: 'upload-excel', component: () => import('@/views/examples/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'Excel上传' }, hidden: true },
  //   { path: 'download', component: () => import('@/views/examples/zip/index'), name: 'exportZip', meta: { title: '导出Zip' }, hidden: true },
  //   { path: 'theme', component: () => import('@/views/examples/theme/index'), name: 'theme', meta: { title: '换皮肤', icon: 'theme' }, hidden: true },
  //   { path: 'clipboard', component: () => import('@/views/examples/clipboard/index'), name: 'clipboardDemo', meta: { title: '复制到剪贴板', icon: 'clipboard' }, hidden: true },
  //   { path: 'page', component: () => import('@/views/examples/permission/page'), name: 'pagePermission', meta: { title: '页面权限' }, hidden: true },
  //   { path: 'directive', component: () => import('@/views/examples/permission/directive'), name: 'directivePermission', meta: { title: '指令权限' }, hidden: true },
  //   { path: 'create', component: () => import('@/views/examples/article/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }, hidden: true },
  //   { path: 'edit/:id(\\d+)', component: () => import('@/views/examples/article/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
  //   { path: 'list', component: () => import('@/views/examples/article/list'), name: 'articleList', meta: { title: '文章列表', icon: 'list' }, hidden: true }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/vehicle',
    component: Layout,
    name: 'vehicle',
    redirect: '/vehicle/realtime',
    meta: { title: '车辆监控' },
    children: [{
      path: 'realtime',
      component: () => import('@/views/vehicle/realtime/index'),
      name: 'realtime',
      meta: { title: '实时监控', noCache: false }
    },
    {
      path: 'replyingHRD',
      component: () => import('@/views/vehicle/replyingHRD/index'),
      name: 'replyingHRD',
      meta: { title: '轨迹回放', noCache: false }
    },
    {
      path: 'regionalZC',
      component: () => import('@/views/vehicle/regionalZC/index'),
      name: 'regionalZC',
      meta: { title: '区域查车', noCache: false }
    },
    {
      path: 'multimedia',
      component: () => import('@/views/vehicle/multimedia/index'),
      name: 'multimedia',
      meta: { title: '多媒体监控', noCache: false }
    },
    {
      path: 'textmessagesAS',
      component: () => import('@/views/vehicle/textmessagesAS/index'),
      name: 'textmessagesAS',
      meta: { title: '文本信息下发', noCache: false }
    }]
  },
  {
    path: '/alarm',
    component: Layout,
    name: 'alarm',
    redirect: '/alarm/intelligentEWP',
    meta: { title: '报警中心' },
    children: [{
      path: 'intelligentEWP',
      component: () => import('@/views/alarm/intelligentEWP/index'),
      name: 'intelligentEWP',
      meta: { title: '智能预警处理', noCache: false }
    },
    {
      path: 'earlyWEI',
      component: () => import('@/views/alarm/earlyWEI/index'),
      name: 'earlyWEI',
      meta: { title: '预警证据查询', noCache: false }
    },
    {
      path: 'vehicleAS',
      component: () => import('@/views/alarm/vehicleAS/index'),
      name: 'vehicleAS',
      meta: { title: '车辆报警设置', noCache: false }
    },
    {
      path: 'vehicleAP',
      component: () => import('@/views/alarm/vehicleAP/index'),
      name: 'vehicleAP',
      meta: { title: '车辆报警处理', noCache: false }
    }]
  },
  {
    path: '/statisticalAnalysis',
    component: Layout,
    name: 'statisticalAnalysis',
    redirect: '/statisticalAnalysis/ADASEarlyWPR',
    meta: { title: '统计分析', noCache: false },
    children: [{
      path: 'ADASEarlyWPR',
      component: () => import('@/views/statisticalAnalysis/ADASEarlyWPR/index'),
      name: 'ADASEarlyWPR',
      meta: { title: '智能预警处理报告', noCache: false }
    },
    {
      path: 'vehicleIEWA',
      component: () => import('@/views/statisticalAnalysis/vehicleIEWA/index'),
      name: 'VehicleIEWA',
      meta: { title: '车辆智能预警分析', noCache: false }
    },
    {
      path: 'abnormalTPS',
      component: () => import('@/views/statisticalAnalysis/abnormalTPS/index'),
      name: 'abnormalTPS',
      meta: { title: '胎压异常预警统计', noCache: false }
    },
    {
      path: 'fireExtinguishingDAWS',
      component: () => import('@/views/statisticalAnalysis/fireExtinguishingDAWS/index'),
      name: 'fireExtinguishingDAWS',
      meta: { title: '灭火装置异常预警统计', noCache: false }
    },
    {
      path: 'vehicleAPR',
      component: () => import('@/views/statisticalAnalysis/vehicleAPR/index'),
      name: 'vehicleAPR',
      meta: { title: '车辆报警处理报告', noCache: false }
    },
    {
      path: 'batteryAS',
      component: () => import('@/views/statisticalAnalysis/batteryAS/index'),
      name: 'batteryAS',
      meta: { title: '电池报警统计', noCache: false }
    },
    {
      path: 'faultAS',
      component: () => import('@/views/statisticalAnalysis/faultAS/index'),
      name: 'faultAS',
      meta: { title: '故障报警统计', noCache: false }
    },
    {
      path: 'electronicFAS',
      component: () => import('@/views/statisticalAnalysis/electronicFAS/index'),
      name: 'electronicFAS',
      meta: { title: '电子围栏报警统计', noCache: false }
    },
    {
      path: 'routePFS',
      component: () => import('@/views/statisticalAnalysis/routePFS/index'),
      name: 'routePFS',
      meta: { title: '线路客流统计', noCache: false }
    },
    {
      path: 'vehiclePFS',
      component: () => import('@/views/statisticalAnalysis/vehiclePFS/index'),
      name: 'vehiclePFS',
      meta: { title: '车辆客流统计', noCache: false }
    },
    {
      path: 'newEnergyRS',
      component: () => import('@/views/statisticalAnalysis/newEnergyRS/index'),
      name: 'newEnergyRS',
      meta: { title: '新能源减排量统计', noCache: false }
    },
    {
      path: 'vehicleLaunchRS',
      component: () => import('@/views/statisticalAnalysis/vehicleLaunchRS/index'),
      name: 'vehicleLaunchRS',
      meta: { title: '车辆上线率统计', noCache: false }
    },
    {
      path: 'statisticsVUDL',
      component: () => import('@/views/statisticalAnalysis/statisticsVUDL/index'),
      name: 'statisticsVUDL',
      meta: { title: '车辆上下线统计', noCache: false }
    },
    {
      path: 'speedingS',
      component: () => import('@/views/statisticalAnalysis/speedingS/index'),
      name: 'speedingS',
      meta: { title: '超速统计', noCache: false }
    },
    {
      path: 'mileageS',
      component: () => import('@/views/statisticalAnalysis/mileageS/index'),
      name: 'mileageS',
      meta: { title: '里程统计', noCache: false }
    },
    {
      path: 'logging',
      component: () => import('@/views/statisticalAnalysis/logging/index'),
      name: 'logging',
      meta: { title: '登录日志', noCache: false }
    },
    {
      path: 'operationalLogbook',
      component: () => import('@/views/statisticalAnalysis/operationalLogbook/index'),
      name: 'operationalLogbook',
      meta: { title: '操作日志', noCache: false }
    },
    {
      path: 'instructionsTL',
      component: () => import('@/views/statisticalAnalysis/instructionsTL/index'),
      name: 'instructionsTL',
      meta: { title: '指令日志', noCache: false }
    }]
  },
  {
    path: '/informationM',
    component: Layout,
    redirect: '/informationM/organizationalM',
    meta: { title: '信息管理', noCache: false },
    children: [{
      path: 'userM',
      component: () => import('@/views/system/user/list'),
      name: 'userM',
      meta: { title: '用户管理', noCache: false }
    },
    {
      path: 'roleM',
      component: () => import('@/views/system/role/index'),
      name: 'roleM',
      meta: { title: '角色管理', noCache: false }
    }, {
      path: 'menuM',
      component: () => import('@/views/informationM/menuM/index'),
      name: 'menuM',
      meta: { title: '菜单管理', noCache: false }
    }, {
      path: 'dictM',
      component: () => import('@/views/informationM/dictM/index'),
      name: 'dictM',
      meta: { title: '字典管理', noCache: false }
    }, {
      path: 'organizationalM',
      component: () => import('@/views/informationM/organizationalM/index'),
      name: 'organizationalM',
      meta: { title: '机构管理', noCache: false }
    },
    {
      path: 'vehicleM',
      component: () => import('@/views/informationM/vehicleM/index'),
      name: 'vehicleM',
      meta: { title: '车辆管理', noCache: false }
    },
    {
      path: 'equipmentM',
      component: () => import('@/views/informationM/equipmentM/index'),
      name: 'equipmentM',
      meta: { title: '设备管理', noCache: false }
    },
    {
      path: 'SIMM',
      component: () => import('@/views/informationM/SIMM/index'),
      name: 'SIMM',
      meta: { title: 'SIM卡管理', noCache: false }
    },
    {
      path: 'driverM',
      component: () => import('@/views/informationM/driverM/index'),
      name: 'driverM',
      meta: { title: '司机管理', noCache: false }
    },
    // {
    //   path: 'vehicleBrandM',
    //   component: () => import('@/views/informationM/vehicleBrandM/index'),
    //   name: 'vehicleBrandM',
    //   meta: { title: '车辆品牌管理', noCache: false }
    // },
    {
      path: 'fenceM',
      component: () => import('@/views/informationM/fenceM/index'),
      name: 'fenceM',
      meta: { title: '围栏管理', noCache: false }
    },
    {
      path: 'lineM',
      component: () => import('@/views/informationM/lineM/index'),
      name: 'lineM',
      meta: { title: '线路管理', noCache: false }
    }]
    // ,
    // {
    //   path: 'deviceExtendM',
    //   component: () => import('@/views/informationM/deviceExtendM/index'),
    //   name: 'deviceExtendM',
    //   meta: { title: '外设管理', noCache: false }
    // },
    // {
    //   path: 'pointM',
    //   component: () => import('@/views/informationM/pointM/index'),
    //   name: 'pointM',
    //   meta: { title: '点位管理', noCache: false }
    // }
  },
  { path: '*', redirect: '/404', hidden: true }
]
