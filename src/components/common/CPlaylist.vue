<template>
  <!-- 封装歌单/专辑列表显示 -->
  <div class="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <div
      v-for="item in playlists"
      :key="item.id"
      class="relative cursor-pointer font-black overflow-hidden rounded-lg"
      @click="toDetailsPage(item.id)"
    >
      <!-- 图片部分 -->
      <div class="w-full aspect-square overflow-hidden">
        <el-image
          :src="optimizeImageUrl(item.picUrl)"
          class="w-full h-full object-cover"
          lazy
          crossorigin="anonymous"
          @load="(e: Event) => onImageLoad(item.id, e)"
        >
          <template #placeholder>
            <div class="w-full h-full flex items-center justify-center bg-gray-100">
              loading<span class="dot">...</span>
            </div>
          </template>
        </el-image>
      </div>

      <!-- 歌单介绍：背景色取封面主题色 -->
      <div
        class="text-white p-2"
        :style="{
          background: themeColors[item.id]
            ? `linear-gradient(to right, ${themeColors[item.id]}, rgba(0,0,0,0.85))`
            : 'linear-gradient(to right, #1f2937, #111827)'
        }"
      >
        <span class="text-sm font-medium line-clamp-2 block h-[2.5rem]">{{ item.name }}</span>
      </div>

      <!-- 播放量 -->
      <div v-if="item.playCount" class="absolute top-2 right-2 text-white text-md font-black">
        {{ formatPlayCount(item.playCount) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatPlayCount, optimizeImageUrl } from '@/utils/format'
import { extractColorFromImage } from '@/utils/color'
import type { PlaylistCardType } from '@/api/types'

const router = useRouter()
const { playlists, type } = defineProps<{
  playlists: PlaylistCardType[]
  type?: string
}>()

/** 各歌单/专辑的主题色缓存，key 为 item.id */
const themeColors = ref<Record<number, string>>({})

/** el-image 加载完成时提取主题色，直接复用已显示的图片，无二次下载 */
async function onImageLoad(id: number, e: Event) {
  const img = e.target as HTMLImageElement
  const color = await extractColorFromImage(img)
  if (color) {
    themeColors.value = { ...themeColors.value, [id]: color }
  }
}

function toDetailsPage(id: number) {
  // 传入album跳转albumDetails，否则都跳转playlistDetails
  router.push({
    name: type == 'album' ? 'albumDetails' : 'playlistDetails',
    params: { id }
  })
}
</script>
