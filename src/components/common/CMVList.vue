<template>
  <!-- 封装video列表 -->
  <div class="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    <div
      v-for="video in videoData"
      :key="video.id"
      class="relative cursor-pointer font-black overflow-hidden transition-transform duration-300 hover:scale-105"
      @click="toVideoDetails(video.id)"
    >
      <!-- 播放量 -->
      <div v-if="video.playCount" class="absolute top-2 right-2 text-white text-md font-black z-10">
        <span>{{ formatPlayCount(video.playCount) }}</span>
      </div>
      <el-image
        :src="optimizeImageUrl(video.cover, 400, 225)"
        class="w-full aspect-[16/9] object-cover rounded-lg"
      >
        <template #placeholder>
          <div class="w-full h-full flex items-center justify-center bg-gray-100">
            loading<span class="dot">...</span>
          </div>
        </template>
      </el-image>
      <div class="mt-2">
        <span class="text-sm font-medium line-clamp-1">{{ video.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatPlayCount } from '@/utils/format'
import { optimizeImageUrl } from '@/utils/format'
import type { VideoType } from '@/api/types'

const router = useRouter()
const { videoData } = defineProps<{ videoData: VideoType[] }>()

function toVideoDetails(id: number) {
  router.push({
    name: 'videoDetails',
    params: { id }
  })
}
</script>
