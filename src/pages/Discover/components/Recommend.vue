<template>
  <div v-loading="isLoading">
    <!-- 轮播图 -->
    <!-- banner 图片(type=0)约为 1080*300，高度按宽度比例自适应，不再写死固定高度 -->
    <div class="w-full aspect-[18/5]">
      <el-carousel :interval="4000" type="card" height="100%" class="h-full" v-if="banners">
        <el-carousel-item v-for="(banner, index) in banners" :key="index" class="rounded-[10px]">
          <img :src="banner.imageUrl" alt="" class="w-full h-full" @click="handleBanner(banner)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="w-full">
      <!-- 标题 -->
      <div class="mt-4 mb-4 cursor-default leading-6 text-1xl font-bold">
        <span>你的歌单补给站</span>
        <el-icon class="relative top-[0.2rem]">
          <ArrowRight />
        </el-icon>
      </div>
      <!-- 推荐歌单列表 -->
      <Playlist :playlists="playlists" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { bannerApi, personalizedPlaylistApi } from '@/api/discovery'
import { songDetailsApi } from '@/api/playlist'
import Playlist from '@/components/common/CPlaylist.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '@/stores/player'
import type { BannerType, PlaylistType } from '@/api/types'

const router = useRouter()
const store = usePlayerStore()

const isLoading = ref(true)
// 轮播图数据
const banners = ref<BannerType[]>([])
/** 推荐歌单列表 */
const playlists = ref<PlaylistType[]>([])

async function getData() {
  isLoading.value = true
  try {
    const [bannersRes, playlistRes] = await Promise.all([bannerApi(), personalizedPlaylistApi()])
    banners.value = bannersRes.banners
    playlists.value = playlistRes.result
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/** 处理点击 banner */
async function handleBanner(banner: BannerType) {
  if (banner.targetType === 1000) {
    router.push({
      name: 'playlistDetails',
      params: { id: banner.targetId }
    })
  } else if (banner.targetType === 10) {
    router.push({
      name: 'albumDetails',
      params: { id: banner.targetId }
    })
  } else if (banner.targetType === 1) {
    // 新歌首发：直接播放这首新歌
    await playNewSong(banner.targetId)
  } else {
    ElMessage.info('特殊Banner,暂时无法处理')
  }
}

/** 新歌首发：插入到播放列表末尾并播放（已存在则不重复添加） */
async function playNewSong(songId: number) {
  const res = await songDetailsApi(String(songId))
  const song = res.songs[0]
  if (!song) {
    ElMessage.warning('获取新歌失败')
    return
  }
  // 去重：歌单中已存在则不再重复添加
  if (!store.playlist.some((item) => item.id === song.id)) {
    store.playlist = [...store.playlist, song]
  }
  store.isPlaying = false
  // 定位到这首歌并播放
  store.index = store.playlist.findIndex((item) => item.id === song.id)
  store.updateCurSong()
}

onMounted(() => {
  getData()
})
</script>
