/**
 * @file authCookie
 * @description 定义了处理身份验证令牌cookies的方法。
 */
import Cookies from "js-cookie";

/**
 * ...说明...
 * @const
 * @type {string}
 */

/**
 * 从cookies中获取存储的身份验证令牌。
 * @return {string|null} 如果存在令牌则返回该令牌，否则返回null。
 */
export function getToken(key) {
  return Cookies.get(key);
}

/**
 * 将身份验证令牌存储到cookies中。
 * @param {string} token 要存储的令牌
 * @return {void}
 */
export function setToken(key, token) {
  return Cookies.set(key, token);
}

/**
 * 从cookies中移除身份验证令牌。
 * @return {void}
 */
export function removeToken(key) {
  return Cookies.remove(key);
}

// export function getRefreshToken() {
//   return Cookies.get(REFRESH_TOKEN_KEY)
// }

// export function setRefreshToken(refreshToken) {
//   return Cookies.set(REFRESH_TOKEN_KEY, refreshToken)
// }

// export function removeRefreshToken() {
//   return Cookies.remove(REFRESH_TOKEN_KEY)
// }
