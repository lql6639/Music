<template>
  <div class="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    <div
      v-for="item in singerlist"
      :key="item.id"
      class="relative cursor-pointer overflow-hidden rounded-lg"
      @click="toSingerDetails(item.id)"
    >
      <div class="w-full aspect-square overflow-hidden">
        <el-image
          :src="optimizeImageUrl(item.picUrl)"
          fit="cover"
          class="w-full h-full"
          lazy
          crossorigin="anonymous"
          @load="(e: Event) => onImageLoad(item.id, e)"
        >
          <template #placeholder>
            <div class="image-slot">loading<span class="dot">...</span></div>
          </template>
        </el-image>
      </div>
      <div
        class="text-white p-2"
        :style="{
          background: themeColors[item.id]
            ? `linear-gradient(to right, ${themeColors[item.id]}, rgba(0,0,0,0.85))`
            : 'linear-gradient(to right, #1f2937, #111827)'
        }"
      >
        <span class="block h-[1.5rem] text-center text-sm">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { optimizeImageUrl } from '@/utils/format'
import { extractColorFromImage } from '@/utils/color'
import type { ArtistType } from '@/api/types'

const { singerlist } = defineProps<{ singerlist: ArtistType[] }>()

const router = useRouter()

/** 各歌手的主题色缓存，key 为 item.id */
const themeColors = ref<Record<number, string>>({})

/** el-image 加载完成时提取主题色，直接复用已显示的图片，无二次下载 */
async function onImageLoad(id: number, e: Event) {
  const img = e.target as HTMLImageElement
  const color = await extractColorFromImage(img)
  if (color) {
    themeColors.value = { ...themeColors.value, [id]: color }
  }
}

function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id }
  })
}
</script>
