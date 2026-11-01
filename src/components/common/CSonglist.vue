<template>
  <!-- 封装歌曲列表 -->
  <div class="songlist">
    <el-table
      :data="props.songlist"
      style="width: 100%"
      stripe
      :row-class-name="addIndex"
      @row-dblclick="playSong"
    >
      <el-table-column type="index" width="50" />
      <!-- 下载标签 -->
      <el-table-column prop="id" label="下载" width="50">
        <template #default="scope">
          <el-icon :size="18" class="download" @click="downloadSong(scope.row.id, scope.row.name)">
            <Download />
          </el-icon>
        </template>
      </el-table-column>
      <!-- 歌曲标题 -->
      <el-table-column prop="name" label="音乐标题" min-width="140">
        <template #default="scope">
          <div class="ellip">
            <span class="clikable" :title="scope.row.name" @click="playSong(scope.row)">{{
              scope.row.name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 歌曲歌手 -->
      <el-table-column prop="ar" label="歌手" min-width="140">
        <template #default="scope">
          <div class="ellip" :title="formatArtists(scope.row.ar)">
            <span v-for="(author, index) in scope.row.ar" :key="author.id">
              <span class="clikable" @click="toSingerDetails(author.id)">
                {{ author.name }}
              </span>
              <!-- 最后一个歌手后面不加分隔符 -->
              <span v-if="index != scope.row.ar.length - 1">/</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <!-- 对应专辑 -->
      <el-table-column prop="al.name" label="专辑" min-width="120">
        <template #default="scope">
          <div class="ellip">
            <span
              class="clikable"
              :title="scope.row.al.name"
              @click="toAlbumDetails(scope.row.al.id)"
              >{{ scope.row.al.name }}</span
            >
          </div>
        </template>
      </el-table-column>
      <!-- 歌曲时长 -->
      <el-table-column prop="dt" label="时长" min-width="60" align="center">
        <template #default="scope">
          <span>{{ msToMinSeconed(scope.row.dt) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { msToMinSeconed } from '@/utils/time'
import { formatArtists } from '@/utils/format'
import { useRouter } from 'vue-router'
import { songDownLoadApi } from '@/api/song'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import type { SongType } from '@/api/types'

const router = useRouter()
const store = usePlayerStore()
const props = defineProps<{ songlist: SongType[] }>()

/** 为 Element Plus 表格行注入索引 */
function addIndex({ row, rowIndex }: { row: SongType; rowIndex: number }) {
  row.index = rowIndex
}

/** 播放音乐 */
async function playSong(row: SongType) {
  // 如果歌单已经变了，就改变歌单（引用比较，O(1) 不遍历数组）
  if (props.songlist !== store.playlist) {
    store.playlist = props.songlist
  }
  // 如果之前有正在播放的歌曲，则先将其执行暂停操作再进行后续步骤
  store.isPlaying = false
  store.index = row.index!
  store.updateCurSong()
}

// 跳转歌手详情
function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id }
  })
}

// 跳转专辑详情
function toAlbumDetails(id: number) {
  router.push({
    name: 'albumDetails',
    params: { id }
  })
}

//下载歌曲
async function downloadSong(id: number, name: string) {
  try {
    // 调用 API 并提取 data 中的 url
    const res = await songDownLoadApi(id)
    if (res.data && typeof res.data.url === 'string') {
      const url = res.data.url

      // 根据url获取文件内容
      const response = await fetch(url)
      // 将文件内容转成二进制
      const blob = await response.blob()
      // 将二进制转成url
      const urlBlob = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = urlBlob
      link.download = `${name}.mp3` // 设置文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // 释放内存
      window.URL.revokeObjectURL(urlBlob)
      ElMessage.success('下载成功,320kpbs超高清')
    } else {
      ElMessage.error('你没有登录或者你不是VIP')
    }
  } catch (error) {
    ElMessage.error(`下载歌曲时发生错误:${error}`)
  }
}
</script>

<style lang="less">
.songlist {
  background-color: transparent;
  cursor: pointer;

  .el-table {
    font-size: 13px;
    // 覆盖 Element Plus 表格的 CSS 变量，使其透明继承背景
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: transparent;
    --el-table-row-hover-bg-color: rgba(0, 0, 0, 0.04);

    // 表头
    thead th {
      background-color: transparent !important;
    }

    // 表体行和单元格
    tbody tr,
    tbody td {
      background-color: transparent !important;
    }

    // 所有单元格
    th,
    td {
      background-color: transparent !important;
    }

    // 隔行变色（斑马纹）
    .el-table__row--striped td.el-table__cell {
      background-color: rgba(255, 255, 255, 0.3) !important;
    }
  }

  // 表格底部（分页区域）
  .el-table__inner-wrapper {
    background-color: transparent;
  }

  .download {
    &:hover {
      color: #ec4141;
      transform: scale(1.1);
    }
  }

  // 单行省略，防止长内容换行撑高表格行
  .ellip {
    display: block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .clikable {
    &:hover {
      color: #ec4141;
      border-bottom: 1px solid #ec4141;
    }
  }
}
</style>
