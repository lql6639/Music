<template>
  <!-- 搜索歌手页 -->
  <div class="searchSinger">
    <!-- 歌手总数 -->
    <div class="count">找到 {{ pageInfo.total }} 位歌手</div>
    <!-- 歌手展示 -->
    <div class="singerlist" v-loading="isLoading">
      <!-- 歌手列表 -->
      <CSingerList :singerlist="singerlist" />
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          v-model:current-page="pageInfo.curPage"
          layout="prev, pager, next"
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          @current-change="getSearchSinger"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchApi } from '@/api/search'
import CSingerList from '../../components/common/CSingerList.vue'
import type { ArtistType } from '@/api/types'

const route = useRoute()

const keywords = computed(() => route.params.keywords as string)

const pageInfo = reactive({
  pageSize: 30,
  curPage: 1,
  total: 0
})

const isLoading = ref(true)

/** 歌手列表 */
const singerlist = ref<ArtistType[]>([])

async function getSearchSinger() {
  isLoading.value = true
  const res = await searchApi(keywords.value, 100, (pageInfo.curPage - 1) * 30)
  const data = res as { result: { artistCount: number; artists: ArtistType[] } }
  pageInfo.total = data.result.artistCount
  singerlist.value = data.result.artists
  console.log(singerlist.value)
  isLoading.value = false
}

getSearchSinger()
</script>

<style lang="less">
.searchSinger {
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
