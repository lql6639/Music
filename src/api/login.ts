import request from '../utils/request'
import type { UserProfileType } from './types'

// ==================== 响应类型 ====================

export interface QRCodeKeyResponse {
  data: {
    unikey: string
  }
}

export interface QRCodeBaseResponse {
  data: {
    qrimg: string
  }
}

export interface QRCodeStateResponse {
  code: number
  cookie?: string
}

export interface LogoutResponse {
  code: number
}

export interface AccountInfoResponse {
  profile: UserProfileType | null
}

// ==================== API 函数 ====================

/** 获取二维码 key */
export const getQRCodeKeyApi = () => {
  return request<QRCodeKeyResponse>({
    url: `/login/qr/key?timestamp=${new Date().getTime()}`,
    method: 'GET'
  })
}

/** 获取二维码 base64 */
export const getQRCodeBaseApi = (key: string) => {
  return request<QRCodeBaseResponse>({
    url: `/login/qr/create?key=${key}&qrimg=true&timestamp=${new Date().getTime()}`,
    method: 'GET'
  })
}

/** 检测二维码扫描状态 */
export const checkQRCodeStateApi = (key: string) => {
  return request<QRCodeStateResponse>({
    url: `/login/qr/check?key=${key}&timestamp=${new Date().getTime()}`,
    method: 'GET'
  })
}

/** 发送验证码 */
export const sendCaptchaApi = (phone: string) => {
  return request({
    url: `/captcha/sent?phone=${phone}`,
    method: 'GET'
  })
}

/** 校验验证码 */
export const checkCaptchaApi = (phone: string, captcha: string) => {
  return request({
    url: `/captcha/verify?phone=${phone}&captcha=${captcha}`,
    method: 'GET'
  })
}

/** 手机号登录 */
export const telLoginApi = (phone: string, captcha: string) => {
  return request({
    url: `/login/cellphone?phone=${phone}&captcha=${captcha}`,
    method: 'GET'
  })
}

/** 获取登录状态 */
export const isLogin = () => {
  return request({
    url: `/login/status`,
    method: 'GET'
  })
}

/** 刷新登录状态 */
export const loginRefresh = () => {
  return request({
    url: `/login/refresh`,
    method: 'GET'
  })
}

/** 退出登录 */
export const logoutApi = () => {
  return request<LogoutResponse>({
    url: `/logout?timestamp=${new Date().getTime()}`,
    method: 'GET'
  })
}

/** 获取账号信息（利用 cookie） */
export const getAccountInfoApi = () => {
  return request<AccountInfoResponse>({
    url: `/user/account`,
    method: 'GET'
  })
}
