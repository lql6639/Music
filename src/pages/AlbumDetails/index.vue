<template>
  <!-- 专辑详情页 -->
  <div>
    <div class="w-full flex items-center mb-4">
      <!-- 专辑封面 -->
      <el-image
        :src="optimizeImageUrl(album.blurPicUrl, 300, 300)"
        lazy
        crossorigin="anonymous"
        class="w-40 h-40 rounded-xl"
        @load="onMainBgChange"
      >
        <template #placeholder>
          <div class="image-slot">loading<span class="dot">...</span></div>
        </template>
      </el-image>
      <!-- 专辑信息 -->
      <div class="ml-4">
        <!-- 标题 -->
        <div class="flex items-center mb-4">
          <span
            class="h-6 w-16 text-red-500 text-sm text-center border border-red-500 rounded-md mr-2"
            >专辑</span
          >
          <span class="text-2xl font-bold text-black">{{ album.name }}</span>
        </div>
        <!-- 操作 -->
        <div class="mb-2">
          <el-button type="danger" @click="playAll" id="playAll">
            <IconPlay class="text-xl" />
            <span class="ml-2">播放全部</span>
          </el-button>
          <el-button type="danger" plain>
            <IconCollect />
            <span class="ml-2">收藏</span>
          </el-button>
        </div>
        <!-- 歌手 -->
        <div class="text-sm text-gray-600 mt-2" v-if="album.artists">
          歌手：
          <span v-for="(ar, index) in album.artists" :key="index">
            {{ ar.name }}
          </span>
        </div>
        <!-- 时间 -->
        <div class="text-sm text-gray-600 mt-2">
          发布时间：{{ timestampToDate(album.publishTime) }}
        </div>
      </div>
    </div>
    <el-tabs v-model="selectedTag" v-loading="isLoading">
      <el-tab-pane label="专辑歌曲" name="songs">
        <CSonglist :songlist="songlist" />
      </el-tab-pane>
      <el-tab-pane label="专辑评论" name="comments">
        <CComments :type="'album'" :id="id" />
      </el-tab-pane>
      <el-tab-pane label="专辑描述" name="descrip">
        <div class="text-sm text-gray-700 leading-relaxed tracking-wider indent-8">
          {{ album.description }}
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { albumDetailsApi, type AlbumDetailsResponse } from '@/api/album'
import { timestampToDate } from '@/utils/time'
import CSonglist from '@/components/common/CSonglist.vue'
import CComments from '@/components/common/CComments.vue'
import IconPlay from '@/assets/icon/IconPlay.vue'
import IconCollect from '@/assets/icon/IconCollect.vue'
import type { SongType } from '@/api/types'
import { useBgColorStore } from '@/stores/bgColor'
import { optimizeImageUrl } from '@/utils/format'

const route = useRoute()
const store = usePlayerStore()

// 全局主内容背景色（由 layout 读取，这里设置主题色）
const bgColorStore = useBgColorStore()

const id = computed(() => route.params.id)

const isLoading = ref(true)

const selectedTag = ref('songs')

/** 专辑详情 */
const album = ref<AlbumDetailsResponse['album']>({
  blurPicUrl: '',
  name: '',
  artists: [],
  publishTime: 0,
  description: ''
})

/** 专辑歌曲 */
const songlist = ref<SongType[]>([])

async function getAlbumDetails() {
  isLoading.value = true
  const res = await albumDetailsApi(id.value)
  console.log(res)
  album.value = res.album
  songlist.value = res.songs
  isLoading.value = false
}

function playAll() {
  if (songlist.value !== store.playlist) {
    store.playlist = songlist.value
  }
  store.index = 0
  store.isPlaying = false
  store.updateCurSong()
}

onMounted(() => {
  getAlbumDetails()
})

// 封面图加载完成后提取主题色，动态设置全局背景色
async function onMainBgChange(e: Event) {
  await bgColorStore.setMainBg(e.target as HTMLImageElement)
}

onUnmounted(() => {
  bgColorStore.resetBgColor()
})
</script>
