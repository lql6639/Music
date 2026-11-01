import request from '../utils/request'
import type { ArtistType, MVType } from './types'

// ==================== 响应类型 ====================

export interface MVListResponse {
  data: MVType[]
  hasMore: boolean
}

export interface MVDetailsResponse {
  data: {
    name: string
    desc: string
    cover: string
    artists: ArtistType[]
    publishTime: string
    playCount: number
  }
}

export interface MVUrlResponse {
  data: {
    url: string
  }
}

// ==================== API 函数 ====================

/** 获取 MVType 列表 */
export const mvApi = (area: string, type: string, order: string, offset: number, limit: number) => {
  return request<MVListResponse>({
    url: `/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

/** 获取 MVType 详情 */
export const mvDetailsApi = (id: number | string | string[]) => {
  return request<MVDetailsResponse>({
    url: `/mv/detail?mvid=${id}`,
    method: 'get'
  })
}

/**
 * 获取 MVType 播放 URL
 * @param id - MVType id
 * @param r  - 分辨率，默认 720，可选值 1080, 720, 480, 360
 */
export const mvUrlApi = (id: number | string | string[], r: number = 720) => {
  return request<MVUrlResponse>({
    url: `/mv/url?id=${id}&r=${r}`,
    method: 'get'
  })
}
