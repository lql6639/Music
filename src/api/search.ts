import request from '../utils/request'

/** 热搜响应 */
export interface HotSearchResponse {
  data: Array<{ searchWord: string }>
}

/**
 * 详细搜索
 * @param type - 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV
 */
export const searchApi = (
  keywords: string | string[],
  type: number,
  offset: number,
  limit: number = 30
) => {
  return request({
    url: `/cloudsearch?keywords=${keywords}&type=${type}&offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

/** 热搜 */
export const hotSearchApi = () => {
  return request<HotSearchResponse>({
    url: `/search/hot/detail`,
    method: 'GET'
  })
}
