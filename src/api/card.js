import request from '@/utils/request'

/**
 * 获取月卡列表
 * @param { page, pageSize} params
 * @returns
 */
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    params
  })
}

/**
 * 新增月卡
 * @data
 * @returns
 */
export function createCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}

/**
 * 获取月卡详情
 * @data
 * @returns
 */
export function getCardDetailAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}


/**
 * 编辑月卡
 * @data
 * @returns
 */
export function updateCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}
