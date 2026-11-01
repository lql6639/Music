import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { songUrlApi, lyricApi } from '@/api/song'
import { formatArtists } from '@/utils/format'
import type { SongType } from '@/api/types'

const LOOP_MODE_KEY = 'mode'
const PLAYING_TITLE_KEY = 'title'
const PLAYLIST_STORAGE_KEY = 'history'

type LoopMode = 'loop' | 'random' | 'cycle'

/** 从 localStorage 读取循环模式，非法值回退顺序循环 */
function loadLoopMode(): LoopMode {
  try {
    const v = localStorage.getItem(LOOP_MODE_KEY)
    if (v === 'loop' || v === 'random' || v === 'cycle') return v
  } catch {
    // 忽略存储异常
  }
  return 'loop'
}

/** 从 localStorage 恢复上次的播放列表与当前歌曲下标 */
function loadHistory(): { playlist: SongType[]; index: number } | null {
  try {
    const raw = localStorage.getItem(PLAYLIST_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Array.isArray(data?.playlist) && data.playlist.length > 0) {
      return { playlist: data.playlist, index: Number(data.index) || 0 }
    }
  } catch {
    // 本地数据损坏时忽略，按无历史处理
  }
  return null
}

export const usePlayerStore = defineStore('player', () => {
  /** 播放列表 */
  const playlist = ref<SongType[]>([])
  // 当前播放下标
  const index = ref(0)
  /** 当前播放歌曲信息 */
  const curSongInfo = ref<SongType>({
    id: 0,
    name: '歌曲',
    // 专辑
    al: {
      id: 0,
      name: '',
      picUrl:
        'https://ts1.cn.mm.bing.net/th/id/R-C.d2f9f4128e684ba537fe9efaf92f1bfd?rik=makKOA%2fy5qn6fA&riu=http%3a%2f%2fwww.kuaipng.com%2fUploads%2fpic%2fw%2f2021%2f04-21%2f99518%2fwater_99518_698_698_.png&ehk=c%2bb01RyizJwmfF4speWlE1bpkSRCtyxWZlU%2f6TPecHk%3d&risl=&pid=ImgRaw&r=0'
    },
    // 艺术家/作者
    ar: [
      {
        id: 0,
        name: '艺术家'
      }
    ],
    // 日期
    dt: 0
  })
  // 当前歌曲的URL
  const curSongUrl = ref('')
  // 歌词 格式：[{ time: 时间戳, lrc: '歌词内容', next: 下一句出现时间戳 }]
  const lyric = ref([{ time: 0, lrc: '暂无歌词', next: 100000 }])
  const isPlaying = ref(false)
  const curDuration = ref(0)
  const showPlaylist = ref(false)
  const showSongDetails = ref(false)
  // 循环模式 loop random cycle，持久化到 localStorage
  const loopMode = ref<LoopMode>(loadLoopMode())

  // 初始化：恢复上次关闭时的播放列表和歌曲（不自动播放，点击播放按钮接着播这首歌）
  const history = loadHistory()
  if (history) {
    playlist.value = history.playlist
    index.value = history.index < history.playlist.length ? history.index : 0
    curSongInfo.value = playlist.value[index.value]
  }

  // 播放列表或当前歌曲变化时，持久化到 localStorage
  watch([playlist, index], () => {
    try {
      localStorage.setItem(
        PLAYLIST_STORAGE_KEY,
        JSON.stringify({ playlist: playlist.value, index: index.value })
      )
    } catch {
      // 存储失败（如隐私模式）不影响正常播放
    }
  })

  // 循环模式变化时持久化
  watch(loopMode, (mode) => {
    try {
      localStorage.setItem(LOOP_MODE_KEY, mode)
    } catch {
      // 忽略存储异常
    }
  })

  // 正在播放时把「歌名 - 歌手」写入 localStorage（供 App.vue 设置标签页 title），暂停/停止时移除
  watch(
    [isPlaying, curSongInfo],
    ([playing, song]) => {
      try {
        if (playing && song?.id) {
          localStorage.setItem(PLAYING_TITLE_KEY, `${song.name} - ${formatArtists(song.ar)}`)
        } else {
          localStorage.removeItem(PLAYING_TITLE_KEY)
        }
      } catch {
        // 忽略存储异常，不影响播放
      }
    },
    { immediate: true }
  )

  // 格式化歌词方法
  const formatLyric = (lyricStr: string) => {
    const lyricArr = lyricStr.split(/[(\r\n)\r\n]+/).map((item: string) => {
      const min = item.slice(1, 3) // 分
      const sec = item.slice(4, 6) // 秒
      let mill: number | string = Number(item.slice(7, 10))
      let lrc = item.slice(11, item.length)

      // 处理两位毫秒的情况
      if (isNaN(Number(mill))) {
        mill = Number(item.slice(7, 9)) * 10
        lrc = item.slice(10, item.length)
      }

      // 计算歌词时间戳（毫秒）
      const time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + Number(mill)
      return { time, lrc, next: 0 }
    })

    // 为每个歌词项设置下一句出现时间
    lyricArr.forEach((item, i) => {
      if (i === lyricArr.length - 1 || isNaN(lyricArr[i + 1].time)) {
        item.next = lyricArr[i + 2] ? lyricArr[i + 2].time : item.time + 1500
      } else {
        item.next = lyricArr[i + 1].time
      }
    })

    return lyricArr
  }

  // 更新当前播放歌曲信息
  const updateCurSong = async () => {
    curSongInfo.value = playlist.value[index.value]

    // 并行获取播放URL和歌词
    const [songUrlRes] = await Promise.all([
      songUrlApi(curSongInfo.value.id),
      loadLyric(curSongInfo.value.id)
    ])

    // 设置当前歌曲URL
    curSongUrl.value = songUrlRes.data[0].url
  }

  // 拉取并格式化指定歌曲的歌词（function 声明提升，供上方初始化恢复历史时调用）
  async function loadLyric(id: number) {
    try {
      const lyricRes = await lyricApi(id)
      lyric.value = formatLyric(lyricRes.lrc.lyric)
    } catch {
      // 歌词获取失败时保持现状（默认「暂无歌词」）
    }
  }

  // 初始化：恢复播放列表后，即使不播放也先拉取上次那首歌的歌词
  if (curSongInfo.value.id) {
    loadLyric(curSongInfo.value.id)
  }

  // 3. 暴露状态和方法（组件中可访问）
  return {
    playlist,
    index,
    curSongInfo,
    curSongUrl,
    lyric,
    isPlaying,
    curDuration,
    showPlaylist,
    showSongDetails,
    loopMode,
    updateCurSong
  }
})
