import request from '../utils/request'

// ==================== 响应类型 ====================

export interface SongUrlResponse {
  data: Array<{
    url: string
  }>
}

export interface LyricResponse {
  lrc: {
    lyric: string
  }
}

export interface SongDownloadResponse {
  data: {
    url: string
  }
}

// ==================== API 函数 ====================

/**
 * 获取音乐播放 URL
 * @param id      - 音乐 id，多个用逗号分隔，如 '1969519579,33894312'
 * @param level   - 播放音质等级: standard | higher | exhigh | lossless | hires | jyeffect | sky | dolby | jymaster
 * @param unblock - 是否使用歌曲解锁
 */
export const songUrlApi = (
  id: number | string,
  level: string = 'higher',
  unblock: boolean = true
) => {
  return request<SongUrlResponse>({
    url: `/song/url/v1?id=${id}&level=${level}&unblock=${unblock}`,
    method: 'GET'
  })
}

/** 获取歌曲歌词 */
export const lyricApi = (id: number) => {
  return request<LyricResponse>({
    url: `/lyric?id=${id}`,
    method: 'GET'
  })
}

/** 下载歌曲（获取下载链接） */
export const songDownLoadApi = (id: number) => {
  return request<SongDownloadResponse>({
    url: `/song/download/url?id=${id}&br=320000`,
    method: 'GET'
  })
}
