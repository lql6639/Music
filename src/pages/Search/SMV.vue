<template>
  <!-- 搜索MV页 -->
  <div class="searchMV">
    <!-- MV总数 -->
    <div class="count">找到 {{ pageInfo.total }} 节 MVType</div>
    <!-- MV展示 -->
    <div class="mvlist" v-loading="isLoading">
      <CVideoList :video-data="mvs" />
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        v-model:current-page="pageInfo.curPage"
        layout="prev, pager, next"
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        @current-change="getSearchMV"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchApi } from '@/api/search'
import CVideoList from '@/components/common/CMVList.vue'
import type { MVType } from '@/api/types'

const route = useRoute()

const keywords = computed(() => route.params.keywords as string)

const isLoading = ref(true)

const pageInfo = reactive({
  pageSize: 20,
  curPage: 1,
  total: 0
})

/** MV 列表 */
const mvs = ref<MVType[]>([])

async function getSearchMV() {
  isLoading.value = true
  const res = await searchApi(keywords.value, 1004, (pageInfo.curPage - 1) * 24, pageInfo.pageSize)
  const data = res as { result: { mvCount: number; mvs: MVType[] } }
  pageInfo.total = data.result.mvCount
  mvs.value = data.result.mvs
  isLoading.value = false
}

getSearchMV()
</script>

<style lang="less">
.searchMV {
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
