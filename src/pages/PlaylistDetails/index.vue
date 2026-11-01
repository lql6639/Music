<template>
  <div class="w-full">
    <!-- 歌单介绍 -->
    <div class="flex mb-4">
      <el-image
        :src="optimizeImageUrl(playlistDetails.coverImgUrl, 300, 300)"
        lazy
        crossorigin="anonymous"
        class="w-40 h-40 rounded-xl"
        @load="onMainBgChange"
      />
      <div class="flex-1 ml-8">
        <!-- 标题 -->
        <div class="flex items-center mb-4">
          <span
            class="h-6 w-16 text-red-500 text-sm text-center border border-red-500 rounded-md mr-2"
            >歌单</span
          >
          <span class="text-2xl font-bold text-black">{{ playlistDetails.name }}</span>
        </div>
        <!-- 作者信息 -->
        <div class="flex items-center mb-4">
          <el-image :src="playlistDetails.creator.backgroundUrl" class="h-8 w-8 mr-2 rounded-lg" />
          <span
            class="text-blue-500 cursor-pointer mr-2"
            @click="toUserDetails(playlistDetails.creator.userId)"
          >
            {{ playlistDetails.creator.nickname }}
          </span>
          <span class="text-xs text-gray-600">
            {{ timestampToDate(playlistDetails.createTime) }}创建</span
          >
        </div>
        <!-- 操作 -->
        <div class="mb-4">
          <el-button type="danger" @click="playAll" id="playAll">
            <IconPlay class="text-xl" />
            <span class="ml-2">播放全部</span>
          </el-button>
          <el-button type="danger" :plain="!subscribed" @click="toggleSubscribe">
            <IconCollect />
            <span class="ml-2">收藏</span>
          </el-button>
        </div>
        <!-- 歌曲数量和播放量 -->
        <div class="flex text-sm text-gray-600">
          <div class="mr-4">歌曲：{{ playlistDetails.trackCount }}首</div>
          <div>播放量: {{ formatPlayCount(playlistDetails.playCount) }} 次</div>
        </div>
      </div>
    </div>
    <el-tabs v-model="selectedTag" v-loading="isLoading">
      <el-tab-pane label="歌单歌曲" name="songs">
        <CSonglist :songlist="songlist" />
      </el-tab-pane>
      <el-tab-pane label="歌单评论" name="comments">
        <CComments :type="'playlist'" :id="id" />
      </el-tab-pane>
      <el-tab-pane label="歌单描述" name="descrip">
        <div class="text-sm text-gray-700 leading-relaxed tracking-wider indent-8">
          {{ playlistDetails.description }}
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 回到顶部 -->
    <el-backtop target=".w-full" :bottom="120"></el-backtop>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  playlistDetailsApi,
  songDetailsApi,
  playlistSubscribeApi,
  playlistUnsubscribeApi
} from '@/api/playlist'
import { timestampToDate } from '@/utils/time'
import { formatPlayCount } from '@/utils/format'
import { usePlayerStore } from '@/stores/player'
import { useBgColorStore } from '@/stores/bgColor'
import CSonglist from '@/components/common/CSonglist.vue'
import CComments from '@/components/common/CComments.vue'
import IconPlay from '@/assets/icon/IconPlay.vue'
import IconCollect from '@/assets/icon/IconCollect.vue'
import { ElMessage } from 'element-plus'
import type { PlaylistType, SongType } from '@/api/types'
import { optimizeImageUrl } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = usePlayerStore()

// 全局主内容背景色（由 layout 读取，这里设置主题色）
const bgColorStore = useBgColorStore()

const isLoading = ref(true)

const id = computed(() => route.params.id)

const selectedTag = ref('songs')

// 歌单详情
const playlistDetails = ref<PlaylistType>({
  id: 0,
  name: '',
  coverImgUrl: '',
  creator: { userId: 0, nickname: '' },
  trackCount: 0,
  playCount: 0,
  description: '',
  createTime: 0,
  subscribed: false,
  trackIds: []
})
/** 歌单中的歌曲 */
const songlist = ref<SongType[]>([])

const subscribed = ref(false)

// 根据id获取歌单详情
async function getPlaylistDetails() {
  isLoading.value = true
  const res = await playlistDetailsApi(id.value)
  // 歌单信息
  playlistDetails.value = res.playlist
  // 收藏状态
  subscribed.value = res.playlist.subscribed
  // 获取歌单中的歌曲信息
  await getSongDetails()
  isLoading.value = false
}

// 收藏或取消收藏歌单
async function toggleSubscribe() {
  // 必须登录才能收藏或取消收藏
  if (!localStorage.getItem('cookie')) {
    ElMessage.warning('请先登录!')
    return
  }
  if (subscribed.value) {
    await playlistUnsubscribeApi(id.value)
    // 不通过网络更新是减少请求次数
    subscribed.value = false
    ElMessage.success('取消收藏成功, 有延迟')
  } else {
    await playlistSubscribeApi(id.value)
    subscribed.value = true
    ElMessage.success('收藏成功, 有延迟')
  }
}

// 根据trackIds查询每曲音乐详情
async function getSongDetails() {
  const ids: number[] = []
  playlistDetails.value.trackIds.forEach((trackId) => {
    ids.push(trackId.id)
  })
  const res = await songDetailsApi(ids.join(','))
  songlist.value = res.songs
}

async function playAll() {
  // 切换到本歌单
  if (songlist.value != store.playlist) {
    store.playlist = songlist.value
  }
  store.index = 0
  store.isPlaying = false
  store.updateCurSong()
}

function toUserDetails(id: number) {
  router.push({
    name: 'userDetails',
    params: { id }
  })
}

onMounted(() => {
  getPlaylistDetails()
})

// 封面图加载完成后提取主题色，动态设置全局背景色
async function onMainBgChange(e: Event) {
  await bgColorStore.setMainBg(e.target as HTMLImageElement)
}

onUnmounted(() => {
  bgColorStore.resetBgColor()
})
</script>
