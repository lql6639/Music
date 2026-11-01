<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 搜索模块 -->
  <div class="search">
    <el-popover v-model:visible="popoverVisible" placement="bottom" width="18rem" trigger="click">
      <template #reference>
        <!-- 搜索框 -->
        <el-input
          v-model.trim="keywords"
          class="search-input"
          placeholder="搜索音乐、歌手、专辑"
          :prefix-icon="Search"
          @input="toSearch"
        ></el-input>
      </template>
      <!-- 热搜列表 -->
      <div class="hotsearch">
        <div class="header">
          <div class="title">Search Hot</div>
          <button class="close-btn" title="关闭" @click="popoverVisible = false">
            <IconClose :size="14" />
          </button>
        </div>
        <div
          v-for="(item, index) in hotSearch"
          :key="index"
          class="item"
          @click="goHotSearch(item.searchWord)"
        >
          <div class="index">{{ index + 1 }}</div>
          <div class="searchWord">{{ item.searchWord }}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { hotSearchApi } from '@/api/search'
import router from '@/router'
import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { debounce } from 'lodash-es'
import IconClose from '@/assets/icon/IconClose.vue'

/**
 * 搜索
 */
const popoverVisible = ref(false)
const keywords = ref('')
// 搜索函数，使用防抖处理，避免频繁请求
const toSearch = debounce(function () {
  // 判断，如果当关键字不为空串时才能进行搜索
  if (keywords.value) {
    // 跳转页面，并传递搜索的关键词
    router.push({
      name: 'searchSongs',
      params: {
        keywords: keywords.value
      }
    })
    popoverVisible.value = false
  }
}, 1000) // 1秒防抖

const hotSearch = ref<{ searchWord: string }[]>()
// 热搜榜单
async function getHotSearch() {
  const res = await hotSearchApi()
  hotSearch.value = res.data
}

// 跳转热搜
function goHotSearch(searchWord: string) {
  router.push({
    name: 'searchSongs',
    params: {
      keywords: searchWord
    }
  })
  keywords.value = searchWord
  popoverVisible.value = false
}

onMounted(() => {
  // 获取热搜榜单
  getHotSearch()
})
</script>

<style lang="less" scoped>
.search {
  margin: 1rem;
  position: relative;

  // 搜索框样式优化
  :deep(.search-input) {
    .el-input__wrapper {
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      padding: 0 15px;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        border-color: #d1d5db;
      }

      input {
        color: #333;
        height: 36px;

        &::placeholder {
          color: #9ca3af;
        }
      }

      .el-input__prefix {
        color: #6b7280;
        margin-right: 8px;
      }
    }
  }

  // 弹出窗口样式
  :deep(.el-popper) {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border: none;
    overflow: hidden;
  }
}

// 热搜榜样式
.hotsearch {
  height: 360px;
  padding: 10px 0;
  background: #fff;
  overflow-y: auto;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    margin: 0 0 8px;

    .title {
      padding: 0;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #333;
      z-index: 1;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: #000;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.15s;

      &:hover {
        color: #333;
        background: #f0f0f0;
      }
    }
  }

  .item {
    display: flex;
    align-items: center;
    padding: 10px 2px;
    border-radius: 8px;
    gap: 10px;
    cursor: pointer;

    &:hover {
      background: #f8f9fa;
    }

    .index {
      width: 24px;
      text-align: center;
      font-weight: 600;
      color: #666;
    }

    // 前三名特殊样式
    &:nth-child(-n + 3) .index {
      color: #ff3a3a;
    }

    .searchWord {
      flex: 1;
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
