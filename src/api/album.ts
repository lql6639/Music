import request from '../utils/request'
import type { ArtistType, SongType } from './types'

/** 专辑详情响应 */
export interface AlbumDetailsResponse {
  album: {
    blurPicUrl: string
    name: string
    artists: ArtistType[]
    publishTime: number
    description: string
  }
  songs: SongType[]
}

/** 获取专辑详情 */
export const albumDetailsApi = (id: number | string | string[]) => {
  return request<AlbumDetailsResponse>({
    url: `/album?id=${id}`,
    method: 'GET'
  })
}
