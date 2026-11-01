import request from '../utils/request'
import type { PlaylistType, SongType } from './types'

// ==================== 响应类型 ====================

export interface PlaylistDetailsResponse {
  playlist: PlaylistType
}

export interface SongDetailsResponse {
  songs: SongType[]
}

// ==================== API 函数 ====================

/** 获取歌单详情 */
export const playlistDetailsApi = (id: number | string | string[]) => {
  return request<PlaylistDetailsResponse>({
    url: `/playlist/detail?id=${id}`,
    method: 'GET'
  })
}

/** 获取歌曲详情 */
export const songDetailsApi = (ids: string) => {
  return request<SongDetailsResponse>({
    url: `/song/detail?ids=${ids}`
  })
}

/** 收藏歌单 */
export const playlistSubscribeApi = (id: number | string | string[]) => {
  return request({
    url: `/playlist/subscribe?t=1&id=${id}`,
    method: 'GET'
  })
}

/** 取消收藏歌单 */
export const playlistUnsubscribeApi = (id: number | string | string[]) => {
  return request({
    url: `/playlist/subscribe?t=2&id=${id}`,
    method: 'GET'
  })
}
