import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

