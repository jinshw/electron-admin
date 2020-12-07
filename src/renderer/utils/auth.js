import Cookies from 'js-cookie'

const TokenKey = 'sessionId'
var g_TokenValue = null

export function getToken() {
  // return Cookies.get(TokenKey)
  if (process.env.NODE_ENV == 'production') {
    return g_TokenValue
  } else {
    return Cookies.get(TokenKey)
  }
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  if (process.env.NODE_ENV == 'production') {
    g_TokenValue = token
  } else {
    Cookies.set(TokenKey, token)
  }
}

export function setCookies(key, val) {
  // return Cookies.set(key, val)
  if (process.env.NODE_ENV == 'production') {
    g_TokenValue = val
  } else {
    Cookies.set(key, val)
  }

}

export function getCookies(key) {
  // return Cookies.get(key)
  if (process.env.NODE_ENV == 'production') {
    return g_TokenValue
  } else {
    return Cookies.get(key)
  }
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  if (process.env.NODE_ENV == 'production') {
    g_TokenValue = null
  } else {
    Cookies.remove(TokenKey)
  }
}

export function setLocalStorage(name, data) { // localStorage 存储数组对象的方法
  localStorage.setItem(name, JSON.stringify(data))
}

export function getLocalStorage(name) { // localStorage 获取数组对象的方法
  return JSON.parse(window.localStorage.getItem(name))
}

export function removeLocalStorage(name) { // localStorage 移除数组对象的方法
  localStorage.removeItem(name)
}
