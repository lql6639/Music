import request from '../utils/request'
import type {
  BannerType,
  PlaylistType,
  TagType,
  ToplistItemType,
  ArtistType,
  SongType
} from './types'

// ==================== 响应类型 ====================

export interface BannerResponse {
  banners: BannerType[]
}

export interface PersonalizedPlaylistResponse {
  result: PlaylistType[]
}

export interface PlaylistTagResponse {
  sub: TagType[]
}

export interface HotTagResponse {
  tags: TagType[]
}

export interface HandpickResponse {
  playlists: PlaylistType[]
}

export interface ToplistResponse {
  list: ToplistItemType[]
}

export interface SingerlistResponse {
  artists: ArtistType[]
  more: boolean
}

export interface DailyStarPlaylistResponse {
  recommend: PlaylistType[]
}

export interface DailyStarSongsResponse {
  data: {
    dailySongs: SongType[]
  }
}

// ==================== API 函数 ====================

/** 轮播图 */
export const bannerApi = () => {
  return request<BannerResponse>({ url: `/banner?type=0`, method: 'GET' })
}

/** 推荐歌单 */
export const personalizedPlaylistApi = () => {
  return request<PersonalizedPlaylistResponse>({ url: `/personalized?limit=30`, method: 'GET' })
}

/** 歌单标签列表 */
export const playlistTagApi = () => {
  return request<PlaylistTagResponse>({ url: `/playlist/catlist`, method: 'GET' })
}

/** 热门歌单分类 */
export const hotTagApi = () => {
  return request<HotTagResponse>({ url: `/playlist/hot`, method: 'GET' })
}

/** 根据分类获取歌单（网友精选碟） */
export const handpickApi = (tag: string, currentPage: number) => {
  return request<HandpickResponse>({
    url: `/top/playlist?cat=${tag}&offset=${currentPage * 20}&limit=20`,
    method: 'GET'
  })
}

/** 所有榜单 */
export const toplistApi = () => {
  return request<ToplistResponse>({
    url: `/toplist/detail`,
    method: 'GET'
  })
}

/** 根据分类获取歌手 */
export const singerlistApi = (
  area: number,
  type: number,
  initial: string,
  offset: number,
  limit: number
) => {
  return request<SingerlistResponse>({
    url: `/artist/list?&area=${area}&type=${type}&initial=${initial}&offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}
