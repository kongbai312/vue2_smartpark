/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 定义校验手机号的校验函数
export function validMobile(mobile) {
  return /^1[3-9]\d{9}$/.test(mobile)
}

// 定义校验手机号的校验函数
export function validMobileRule(rule, value, callback) {
  const plateNumberRegex = /^1[3-9]\d{9}$/
  if (plateNumberRegex.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

//校验车牌号码
export const validateCarNumber = (rule, value, callback) => {
  const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
  if (plateNumberRegex.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的车牌号'))
  }
}
