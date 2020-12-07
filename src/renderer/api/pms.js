import request from '@/utils/request'

export function queryPMList(data) {
  return request({
    url: '/pmsinfo/list',
    method: 'post',
    data
  })
}
export function addProjectInfo(data) {
  return request({
    url: '/pmsinfo/addProjectInfo',
    method: 'post',
    data
  })
}
export function editProjectInfo(data) {
  return request({
    url: '/pmsinfo/editProjectInfo',
    method: 'post',
    data
  })
}
export function deleteProjectInfo(data) {
  return request({
    url: '/pmsinfo/deleteProjectInfo',
    method: 'post',
    data
  })
}
export function restoreProjectInfo(data) {
  return request({
    url: '/pmsinfo/restoreProjectInfo',
    method: 'post',
    data
  })
}
export function getAreaList(data) {
  return request({
    url: '/pmsinfo/getAreaList',
    method: 'post',
    data
  })
}
export function getFileClass(data) {
  return request({
    url: '/pmsinfo/getFileClass',
    method: 'post',
    data
  })
}

export function fileUpload(data) {
  return request({
    url: '/pmsinfo/fileUpload',
    method: 'post',
    data
  })
}

export function queryFileList(data) {
  return request({
    url: '/pmsfile/queryList',
    method: 'post',
    data
  })
}

export function fileDownLoad(data) {
  return request({
    url: '/pmsfile/fileDownLoad',
    method: 'post',
    data
  })
}
export function fileDelete(data) {
  return request({
    url: '/pmsfile/delete',
    method: 'post',
    data
  })
}
export function getExportPropList(data) {
  return request({
    url: '/pmsinfo/getExportPropList',
    method: 'post',
    data
  })
}
