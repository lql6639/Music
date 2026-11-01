<template>
  <div class="h-full">
    <!-- 歌手分类 -->
    <div class="my-4">
      <!-- 地区/性别/首字母 三类筛选共用一套渲染逻辑 -->
      <div v-for="cfg in singerCategory" :key="cfg.opt" class="flex items-start my-4">
        <div class="flex flex-wrap gap-1 text-sm">
          <div
            v-for="item in cfg.options"
            :key="item.key"
            class="px-3 py-2 rounded-lg cursor-pointer border transition-all duration-300 hover:-translate-y-0.5"
            :class="
              item.key === condition[cfg.selectedKey]
                ? 'text-[#ec4141] bg-[rgba(236,65,65,0.08)] border-[rgba(236,65,65,0.2)]'
                : 'bg-white border-[#eee] hover:bg-[rgba(236,65,65,0.08)] hover:border-[rgba(236,65,65,0.2)]'
            "
            @click="switchOpt(item.key, cfg.opt)"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 歌手列表 -->
    <CSingerList :singerlist="singerlist" v-loading="isLoading" />
    <!-- 是否继续加载 -->
    <div class="flex justify-center p-2" v-show="!isLoading">
      <el-button color="#ed5736" plain @click="continueLoading">more...</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { singerlistApi } from '@/api/discovery'
import { ElMessage } from 'element-plus'
import CSingerList from '@/components/common/CSingerList.vue'
import type { ArtistType } from '@/api/types'

// ==================== 歌手分类静态数据 ====================

const singerCategory = [
  {
    // 地区分类
    opt: 'area',
    selectedKey: 'areaKey',
    options: [
      { key: -1, name: '全部' },
      { key: 7, name: '华语' },
      { key: 96, name: '欧美' },
      { key: 8, name: '日本' },
      { key: 16, name: '韩国' },
      { key: 0, name: '其他' }
    ]
  },
  {
    // 类型分类
    opt: 'type',
    selectedKey: 'typeKey',
    options: [
      { key: -1, name: '全部' },
      { key: 1, name: '男歌手' },
      { key: 2, name: '女歌手' },
      { key: 3, name: '乐队' }
    ]
  },
  {
    // 首字母分类
    opt: 'initial',
    selectedKey: 'initialKey',
    options: [
      { key: '-1', name: '热门' },
      { key: 'a', name: 'A' },
      { key: 'b', name: 'B' },
      { key: 'c', name: 'C' },
      { key: 'd', name: 'D' },
      { key: 'e', name: 'E' },
      { key: 'f', name: 'F' },
      { key: 'g', name: 'G' },
      { key: 'h', name: 'H' },
      { key: 'i', name: 'I' },
      { key: 'j', name: 'J' },
      { key: 'k', name: 'K' },
      { key: 'l', name: 'L' },
      { key: 'm', name: 'M' },
      { key: 'n', name: 'N' },
      { key: 'o', name: 'O' },
      { key: 'p', name: 'P' },
      { key: 'q', name: 'Q' },
      { key: 'r', name: 'R' },
      { key: 's', name: 'S' },
      { key: 't', name: 'T' },
      { key: 'u', name: 'U' },
      { key: 'v', name: 'V' },
      { key: 'w', name: 'W' },
      { key: 'x', name: 'X' },
      { key: 'y', name: 'Y' },
      { key: 'z', name: 'Z' },
      { key: '0', name: '#' }
    ]
  }
] as const

const isLoading = ref(true)
/** 歌手分类查询条件 */
const condition = reactive({
  areaKey: -1,
  typeKey: -1,
  initialKey: '-1',
  count: 1,
  limit: 30,
  isMore: false
})
/** 歌手列表 */
const singerlist = ref<ArtistType[]>([])

async function getSingerlist() {
  isLoading.value = true
  try {
    const res = await singerlistApi(
      condition.areaKey,
      condition.typeKey,
      condition.initialKey,
      (condition.count - 1) * condition.limit,
      condition.limit
    )
    singerlist.value.push(...res.artists)
    condition.isMore = res.more
  } catch (error) {
    console.error('获取歌手列表失败:', error)
    ElMessage.error('获取歌手列表失败，请稍后重试！')
  } finally {
    isLoading.value = false
  }
}

/** 切换分类条件 */
function switchOpt(key: number | string, opt: string) {
  if (opt === 'area') {
    condition.areaKey = Number(key)
  } else if (opt === 'type') {
    condition.typeKey = Number(key)
  } else {
    condition.initialKey = String(key)
  }
  // 清空
  singerlist.value = []
  condition.count = 1
  getSingerlist()
}

// 继续加载
function continueLoading() {
  if (condition.isMore) {
    condition.count++
    getSingerlist()
  } else {
    ElMessage.warning('暂无更多数据!')
  }
}

onMounted(() => {
  getSingerlist()
})
</script>
