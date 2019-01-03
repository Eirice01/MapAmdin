# MapAmdin
、说明
  基于 vue https://github.com/vuejs/vue 和 element https://github.com/ElemeFE/element 的前端框架

2、环境要求：
  本地安装node http://nodejs.org

3、前端技术：
  ES2015+ http://es6.ruanyifeng.com
  vue https://cn.vuejs.org/index.html
  vuex https://vuex.vuejs.org/zh-cn/
  vue-router https://router.vuejs.org/zh-cn/
  axios https://github.com/axios/axios
  element-ui https://github.com/ElemeFE/element
  Mock.js 接口 https://github.com/nuysoft/Mock
  form validator https://github.com/yiminghe/async-validator

3、开发
  3.1 安装依赖
  npm install
   
  通过如下操作解决 npm 下载速度慢的问题
  npm install --registry=https://registry.npm.taobao.org

  3.2 启动服务
  npm run dev
  浏览器访问 http://localhost:5100

4、发布
  4.1 构建测试环境
  npm run build:sit

  4.2 构建生产环境
  npm run build:prod

5、其它
  5.1 构建包文件大小分析
  npm run build:prod --report

  5.2 本地启动预览
  npm run build:prod --preview

  5.3 lint code
  npm run lint

  5.4 auto fix
  npm run lint -- --fix
  //政府级大流量车辆管控系统，具有实时监控，区域统计，地域范围延申广等特点
