import request from '@/utils/request'

// workspace
export function getList(data) {
  return request({
    url: '/workspace/list',
    method: 'post',
    data
  })
}
export function addWorkapce(data) {
  return request({
    url: '/workspace/add',
    method: 'post',
    data
  })
}
export function editWorkapce(data) {
  return request({
    url: '/workspace/edit',
    method: 'post',
    data
  })
}
export function deleteWorkapce(data) {
  return request({
    url: '/workspace/delete',
    method: 'post',
    data
  })
}

// clazz
export function addClazz(data) {
  return request({
    url: '/clazz/add',
    method: 'post',
    data
  })
}
export function updateClazz(data) {
  return request({
    url: '/clazz/update',
    method: 'post',
    data
  })
}
export function deleteClazz(data) {
  return request({
    url: '/clazz/delete',
    method: 'post',
    data
  })
}
export function getTree(data) {
  return request({
    url: '/clazz/tree',
    method: 'post',
    data
  })
}

// ----------------------------------------------------------------
// maplayer
export function getMaplayerList(data) {
  return request({
    url: '/maplayer/list',
    method: 'post',
    data
  })
}
export function synExeMaplayer(data) {
  return request({
    url: '/maplayer/synexe',
    method: 'post',
    data
  })
}
export function deleteMaplayer(data) {
  return request({
    url: '/maplayer/delete',
    method: 'post',
    data
  })
}