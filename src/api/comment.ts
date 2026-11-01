import request from '../utils/request'
import type { CommentType } from './types'

/** 评论列表响应 */
export interface CommentResponse {
  hotComments: CommentType[]
  comments: CommentType[]
  total?: number
}

/** 歌曲评论 */
export const songCommentApi = (id: number | string | string[]) => {
  return request<CommentResponse>({
    url: `/comment/music?id=${id}`,
    method: 'GET'
  })
}

/** 歌单评论 */
export const playlistCommentApi = (id: number | string | string[]) => {
  return request<CommentResponse>({
    url: `/comment/playlist?id=${id}`,
    method: 'GET'
  })
}

/** 专辑评论 */
export const albumCommentApi = (id: number | string | string[]) => {
  return request<CommentResponse>({
    url: `/comment/album?id=${id}`,
    method: 'GET'
  })
}

/** MV评论 */
export const mvCommentApi = (id: number | string | string[]) => {
  return request<CommentResponse>({
    url: `/comment/mv?id=${id}`,
    method: 'GET'
  })
}
