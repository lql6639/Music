<template>
  <!-- 播放列表 -->
  <div class="playlist">
    <div class="amount">总{{ store.playlist.length || 0 }}首</div>
    <el-table
      ref="tableRef"
      :data="store.playlist"
      stripe
      :row-class-name="addIndex"
      @row-click="playSong"
      empty-text="暂无歌曲"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="音乐标题">
        <template #default="scope">
          <span :title="scope.row.name">{{ truncateText(scope.row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ar" label="歌手">
        <template #default="scope">
          <span :title="artistText(scope.row)">{{ truncateText(artistText(scope.row)) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 定位到当前播放的歌曲（点击后高亮行滚动到约 60% 高度处） -->
    <div class="locateBtn" title="定位到当前播放的歌曲" @click="scrollToActive(0.6)">
      <el-icon :size="18"><Aim /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { Aim } from '@element-plus/icons-vue'
import type { SongType } from '@/api/types'
import { formatArtists, truncateText } from '@/utils/format'

const store = usePlayerStore()

// 播放列表表格实例
const tableRef = ref()

/** 多歌手拼接展示 */
function artistText(row: SongType) {
  return formatArtists(row.ar)
}

/**
 * 把当前播放的行滚动到容器 ratio 比例高度处
 * 注意：表格未设 height，滚动发生在抽屉的 .el-drawer__body 上，而不是表格内部
 */
async function scrollToActive(ratio = 0.5, retries = 20) {
  await nextTick()
  const table: any = tableRef.value
  const row: HTMLElement | null | undefined = table?.$el?.querySelector('.el-table__row.active')
  const wrap: HTMLElement | null = table?.$el?.closest('.el-drawer__body') ?? null
  // 抽屉有 300ms 打开动画，内容可能还没渲染完，用 rAF 重试直到可定位
  if (!row || !wrap || !wrap.clientHeight) {
    if (retries > 0) requestAnimationFrame(() => scrollToActive(ratio, retries - 1))
    return
  }
  const rowRect = row.getBoundingClientRect()
  const wrapRect = wrap.getBoundingClientRect()
  // 让行中心落在 ratio * 容器高度处；靠前/靠后的歌由浏览器自动夹紧到合法滚动范围
  const top =
    wrap.scrollTop + rowRect.top - wrapRect.top - wrap.clientHeight * ratio + rowRect.height / 2
  wrap.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
}

// 打开播放列表时，定位到当前播放的歌曲（刷新页面后也能定位到恢复的那首）
watch(
  () => store.showPlaylist,
  (show) => {
    if (show) scrollToActive(0.5)
  }
)

// 抽屉打开期间切歌，跟随定位
watch(
  () => store.index,
  () => {
    if (store.showPlaylist) scrollToActive(0.5)
  }
)

/** 为 Element Plus 表格行注入索引并高亮当前播放 */
function addIndex({ row, rowIndex }: { row: SongType; rowIndex: number }) {
  row.index = rowIndex
  if (rowIndex === store.index) {
    return 'active'
  }
}

function playSong(row: SongType) {
  store.isPlaying = false
  store.index = row.index!
  store.updateCurSong()
}
</script>

<style lang="less">
.playlist {
  position: relative;

  .amount {
    font-size: 13px;
    color: #aaa;
    padding: 1rem;
  }

  .el-table {
    width: 100%;
    cursor: pointer;
    border-radius: 10px;
    margin-bottom: 70px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .active {
    color: #ec4141;
  }

  // 定位按钮（仿发现歌单页的返回顶部按钮样式）
  // fixed 相对视口定位：不随抽屉内容滚动，打开抽屉即可见
  .locateBtn {
    position: fixed;
    right: 2rem;
    bottom: 6rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    color: #409eff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;

    &:hover {
      background: #f2f2f2;
    }
  }
}
</style>
