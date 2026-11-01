<template>
  <!-- 搜索专辑页 -->
  <div class="searchAlbum">
    <!-- 专辑总数 -->
    <div class="count">找到 {{ pageInfo.total }} 张专辑</div>
    <!-- 专辑列表 -->
    <div class="albums" v-loading="isLoading">
      <CPlaylist :playlists="albums" :type="'album'" />
      <div class="pagination">
        <el-pagination
          background
          v-model:current-page="pageInfo.curPage"
          layout="prev, pager, next"
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          @current-change="getSearchAlbum"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchApi } from '@/api/search'
import CPlaylist from '@/components/common/CPlaylist.vue'
import type { AlbumType } from '@/api/types'

const route = useRoute()

const keywords = computed(() => route.params.keywords as string)

const pageInfo = reactive({
  pageSize: 30,
  curPage: 1,
  total: 0
})

const isLoading = ref(true)

/** 专辑列表 */
const albums = ref<AlbumType[]>([])

async function getSearchAlbum() {
  isLoading.value = true
  const res = await searchApi(keywords.value, 10, (pageInfo.curPage - 1) * 30)
  const data = res as { result: { albumCount: number; albums: AlbumType[] } }
  pageInfo.total = data.result.albumCount
  albums.value = data.result.albums
  isLoading.value = false
}

getSearchAlbum()
</script>

<style lang="less">
.searchAlbum {
  width: 100%;

  .count {
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
}
</style>
