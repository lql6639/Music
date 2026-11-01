import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userDetailsApi, userPlaylistApi } from '@/api/user'
import type { PlaylistType, UserProfileType } from '@/api/types'

export const useUserStore = defineStore('user', () => {
  /** 用户ID */
  const uid = ref(0)
  /** 用户信息 */
  const userInfo = ref<UserProfileType & { level: number }>({
    level: 0,
    userId: 0,
    nickname: '',
    avatarUrl: ''
  })
  /** 创建的歌单 */
  const createdPlaylist = ref<PlaylistType[]>([])
  /** 收藏/订阅的歌单 */
  const subscribedPlaylist = ref<PlaylistType[]>([])

  /** 获取用户数据 */
  const getUserData = async () => {
    // 获取用户信息
    const info = await userDetailsApi(uid.value)
    userInfo.value = { ...info.profile, level: info.level }

    // 获取用户歌单
    const res = await userPlaylistApi(uid.value)

    // 清空历史歌单数据
    createdPlaylist.value = []
    subscribedPlaylist.value = []

    // 区分创建的歌单和订阅的歌单
    res.playlist.forEach((item) => {
      // 适配CPlaylist组件的picUrl字段
      item.picUrl = item.coverImgUrl

      if (!item.subscribed) {
        createdPlaylist.value.push(item)
      } else {
        subscribedPlaylist.value.push(item)
      }
    })
  }

  return {
    uid,
    userInfo,
    createdPlaylist,
    subscribedPlaylist,
    getUserData
  }
})
