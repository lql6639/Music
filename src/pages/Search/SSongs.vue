<template>
  <!-- 搜索单曲页 -->
  <div class="searchSongs">
    <!-- 歌曲总数 -->
    <div class="count">找到 {{ pageInfo.total }} 首单曲</div>
    <!-- 歌曲展示 -->
    <div class="songs" v-loading="isLoading">
      <!-- 歌曲列表 -->
      <CSonglist :songlist="songlist" />
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          v-model:current-page="pageInfo.curPage"
          layout="prev, pager, next"
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          @current-change="getSearchSongs"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import CSonglist from '@/components/common/CSonglist.vue'
import { searchApi } from '@/api/search'
import type { SongType } from '@/api/types'

const route = useRoute()

const keywords = computed(() => route.params.keywords as string)

const isLoading = ref(true)

const pageInfo = reactive({
  pageSize: 30,
  curPage: 1,
  total: 0
})

const songlist = ref<SongType[]>([])

async function getSearchSongs() {
  isLoading.value = true
  const res = await searchApi(keywords.value, 1, (pageInfo.curPage - 1) * 30)
  const data = res as { result: { songCount: number; songs: SongType[] } }
  pageInfo.total = data.result.songCount
  songlist.value = data.result.songs
  isLoading.value = false
}

getSearchSongs()
</script>

<style lang="less">
.searchSongs {
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
