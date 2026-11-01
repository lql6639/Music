<template>
  <!-- 用户详情页 -->
  <div>
    <!-- 用户信息 -->
    <div class="flex px-4 w-full mb-8" v-loading="isLoading">
      <div class="h-48 w-48 rounded-full overflow-hidden shrink-0">
        <el-image :src="userInfo.avatarUrl" fit="cover" class="w-full h-full" />
      </div>
      <div class="ml-8 flex-1 min-w-0">
        <!-- 基本信息 -->
        <div class="flex items-center pl-4">
          <div class="text-2xl font-semibold mr-4">{{ userInfo.nickname }}</div>
          <div
            class="text-[13px] w-[2.2rem] h-[1.2rem] leading-[1.2rem] rounded-[10px] text-center bg-[#ccc]"
          >
            Lv.{{ userInfo.level }}
          </div>
        </div>
        <el-divider />
        <!-- 用户数据 -->
        <div class="flex mb-4">
          <div
            class="border-r border-[#ddd] text-center px-3 cursor-pointer hover:text-[#ec4141] transition-transform"
            @click="toFollows"
          >
            <div class="text-md font-bold">关注 {{ userInfo.follows }}</div>
          </div>
          <div
            class="text-center px-3 cursor-pointer hover:text-[#ec4141] transition-transform"
            @click="toFolloweds"
          >
            <div class="text-md font-bold">粉丝 {{ userInfo.followeds }}</div>
          </div>
        </div>
        <!-- 简介 -->
        <div class="pl-2 text-md mb-4">
          简介：<span class="text-[#444]">{{ userInfo.signature }} </span>
          <span v-if="!userInfo.signature" class="text-[#444]">暂无个人介绍</span>
        </div>
        <!-- 用户 id -->
        <div class="pl-2 text-xs mb-2">
          用户ID：<span class="text-[#444]">{{ userInfo.userId }}</span>
        </div>
      </div>
    </div>
    <!-- 创建的歌单 -->
    <div v-if="createdPlaylist.length" class="mb-4">
      <div class="text-lg font-semibold mb-2 p-2">
        {{ pronoun }}创建的歌单({{ createdPlaylist.length }})
      </div>
      <CPlaylist :playlists="createdPlaylist" />
    </div>
    <!-- 收藏的歌单 -->
    <div v-if="subscribedPlaylist.length" class="mb-4">
      <div class="text-lg font-semibold mb-2 p-2">
        {{ pronoun }}收藏的歌单({{ subscribedPlaylist.length }})
      </div>
      <CPlaylist :playlists="subscribedPlaylist" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userDetailsApi, userPlaylistApi } from '@/api/user'
import CPlaylist from '@/components/common/CPlaylist.vue'
import { useUserStore } from '@/stores/user'
import type { UserProfileType, PlaylistType } from '@/api/types'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const id = computed(() => {
  return route.params.id || userStore.userInfo.userId
})

const pronoun = computed(() => {
  return String(id.value) === String(userStore.userInfo.userId) ? '我' : 'TA'
})

const isLoading = ref(true)

/** 用户信息 */
const userInfo = ref<UserProfileType>({
  userId: 0,
  nickname: '',
  avatarUrl: ''
})
/** 用户创建的歌单 */
const createdPlaylist = ref<PlaylistType[]>([])
/** 用户收藏的歌单 */
const subscribedPlaylist = ref<PlaylistType[]>([])

async function getUserDetails() {
  isLoading.value = true
  const info = await userDetailsApi(id.value)
  userInfo.value = { ...info.profile, level: info.level }
  const res = await userPlaylistApi(id.value)
  res.playlist.forEach((item) => {
    item.picUrl = item.coverImgUrl
    if (!item.subscribed) {
      createdPlaylist.value.push(item)
    } else {
      subscribedPlaylist.value.push(item)
    }
  })
  isLoading.value = false
}

function toFollows() {
  router.push({
    name: 'follows',
    params: { id: id.value }
  })
}
function toFolloweds() {
  router.push({
    name: 'followeds',
    params: { id: id.value }
  })
}

onMounted(() => {
  getUserDetails()
})
</script>
