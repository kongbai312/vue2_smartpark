import request from '@/utils/request'

/**
 * 获取企业列表
 * @param { page, pageSize} params
 * @returns
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}

/**
 * 获取行业列表
 * @returns
 */
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 上传合同
 * @returns
 */
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}

/**
 * 创建公司
 * @param {*} data
 * @returns
 */
export function createEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 获取企业详情
 * @param {*} id
 * @returns
 */
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export function updateEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

/**
 * 删除企业
 * @param {*} id
 * @returns
 */
export function delEnterpriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取楼宇列表
 * @param {*} id
 * @returns
 */
export function getRentBuildListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 创建合同
 * @param {*}
 * @returns
 */
export function createRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 获取合同列表
 * @param {*} id
 * @returns
 */
export function getRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}
