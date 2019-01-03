import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 100000 // request timeout
})

// 发送请求前对请求数据进行处理
service.defaults.transformRequest = [function(data) {
  /**
   * axios默认请求Context-type是application/json，也就是默认发送json格式参数，后台需要用@RequestBody进行处理
   * 这里统一用qs对请求参数进行格式化成FormData格式
   */
  return qs.stringify(data)
}]

// 请求拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['XN-Auth']为自定义Header key
    config.headers['XN-Auth'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  /* response => {
    return response.data
  }, */
  /**
   * 通过在response里自定义code来标示请求状态，这里根据不同的code情况做相应的处理<br>
   * 也可以通过XMLHttpRequest对象状态码标识进行相应的处理
   */
  response => {
    const res = response.data
    if (res.code !== 0) {
      // 1004:Token 过期了
      if (res.code === 1004) {
        // 请自行在引入 MessageBox
        MessageBox.confirm('你的登录认证失效，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        // 统一处理系统异常，不再发给上层业务
      } else if (res.code === 1001 || res.code === 1002 || res.code === 1003 || res.code === 1005 || res.code === 1006 || res.code === 1007 || res.code === 1008 || res.code === 1009 || res.code === 1010) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      } else { // 对其它返回状态码是非0的情况，这里捕获并返回reject的Promise对象，上层业务通过catch处理异常信息
        return Promise.reject(res)
      }
    } else {
      return res
    }
  },
  error => { // 对XMLHttpRequest状态码非200的处理
    console.log('err：' + JSON.stringify(error)) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
