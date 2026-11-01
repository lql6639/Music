import request from '../utils/request'
import type { SongType, AlbumType, MVType } from './types'

// ==================== 响应类型 ====================

export interface SingerDetailsResponse {
  data: {
    artist: {
      cover: string
      name: string
      musicSize: number
      albumSize: number
      mvSize: number
      briefDesc: string
    }
    user: {
      followed: boolean
    }
  }
}

export interface SingerHotSongResponse {
  songs: SongType[]
}

export interface SingerAlbumResponse {
  hotAlbums: AlbumType[]
}

export interface SingerMVResponse {
  mvs: MVType[]
  hasMore: boolean
}

// ==================== API 函数 ====================

/** 获取歌手详情 */
export const singerDetailsApi = (id: number | string | string[]) => {
  return request<SingerDetailsResponse>({
    url: `/artist/detail?id=${id}`,
    method: 'get'
  })
}

/** 获取歌手热门单曲 50 首 */
export const singerHotSongApi = (id: number | string | string[]) => {
  return request<SingerHotSongResponse>({
    url: `/artist/top/song?id=${id}`,
    method: 'get'
  })
}

/** 获取歌手专辑（最多 30 张） */
export const singerAlbumApi = (id: number | string | string[]) => {
  return request<SingerAlbumResponse>({
    url: `/artist/album?id=${id}`,
    method: 'get'
  })
}

/** 获取歌手 MVType */
export const singerMVApi = (id: number | string | string[], offset: number, limit: number) => {
  return request<SingerMVResponse>({
    url: `/artist/mv?id=${id}&offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

/** 收藏歌手 */
export const singerSubscribeApi = (id: number | string | string[]) => {
  return request({
    url: `/artist/sub?t=1&id=${id}`,
    method: 'GET'
  })
}

/** 取消收藏歌手 */
export const singerUnsubscribeApi = (id: number | string | string[]) => {
  return request({
    url: `/artist/sub?t=0&id=${id}`,
    method: 'GET'
  })
}
