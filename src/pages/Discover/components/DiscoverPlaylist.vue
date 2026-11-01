<template>
  <div
    class="discoveryPlaylist h-[calc(100vh-120px)] w-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
  >
    <!-- 歌单分类 -->
    <div class="flex h-8 items-center justify-between mb-4">
      <!-- 热门标签 -->
      <div class="hotCategory">
        <el-button
          color="#ed5736"
          plain
          v-for="(h, index) in hotTag"
          :key="index"
          @click="changeHotCategory(index)"
        >
          <span>{{ h.name }}</span>
        </el-button>
      </div>
    </div>
    <div class="w-full" v-loading="loading">
      <!-- 歌单列表 -->
      <CPlaylist :playlists="playlists" :type="'playlist'" />
      <!-- 哨兵元素：进入视口时触发加载更多 -->
      <div v-if="hasMore" ref="sentinelRef" class="text-center p-4 text-[#999] text-[0.9rem]">
        {{ loadingMore ? 'loading...' : 'more' }}
      </div>
    </div>

    <!-- 组件内回到顶部按钮 -->
    <el-backtop target=".discoveryPlaylist" :bottom="120"></el-backtop>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { hotTagApi, handpickApi } from '@/api/discovery'
import CPlaylist from '@/components/common/CPlaylist.vue'
import type { TagType, PlaylistType } from '@/api/types'

const loading = ref(true)
const loadingMore = ref(false)
const hotTag = ref<TagType[]>([])
const currentSelectedName = ref('华语')
const playlists = ref<PlaylistType[]>([])
const pageInfo = ref({
  currentPage: 0,
  pageSize: 20
})
const hasMore = ref(true)
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function getHotTag() {
  const res = await hotTagApi()
  hotTag.value = res.tags
}

function changeHotCategory(index: number) {
  currentSelectedName.value = hotTag.value[index].name
  resetAndLoad()
}

function resetAndLoad() {
  pageInfo.value.currentPage = 0
  playlists.value = []
  hasMore.value = true
  getHandpick(true)
}

/** 获取歌单，isReset 标识是否为重置加载 */
async function getHandpick(isReset = false) {
  if (loadingMore.value || (!hasMore.value && !isReset)) return

  if (isReset) {
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const res = await handpickApi(currentSelectedName.value, pageInfo.value.currentPage)

    res.playlists.forEach((item) => {
      item.picUrl = item.coverImgUrl
    })

    if (isReset) {
      playlists.value = res.playlists
    } else {
      playlists.value = [...playlists.value, ...res.playlists]
    }

    hasMore.value = res.playlists.length === pageInfo.value.pageSize
    pageInfo.value.currentPage++
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// IntersectionObserver：监听哨兵元素进入视口
function setupObserver() {
  observer?.disconnect()
  if (!sentinelRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loadingMore.value) {
        getHandpick()
      }
    },
    { rootMargin: '120px' }
  )
  observer.observe(sentinelRef.value)
}

// 当 hasMore 变为 true 时（切换分类 / 初始加载），哨兵重新挂载，重新观察
watch(hasMore, (val) => {
  if (val) {
    nextTick(() => setupObserver())
  }
})

// 初始化
onMounted(async () => {
  await Promise.all([getHotTag(), getHandpick(true)])
  setupObserver()
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>
