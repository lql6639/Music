<template>
  <!-- 底部栏播放器 -->
  <div class="player" :style="{ background: bgColorStore.bgColor }">
    <!-- 歌曲信息 -->
    <div class="left" @click="store.showSongDetails = !store.showSongDetails">
      <div class="img">
        <el-image :src="store.curSongInfo.al.picUrl">
          <template #placeholder>
            <div class="image-slot">loading<span class="dot">...</span></div>
          </template>
        </el-image>
      </div>
      <div class="name" :title="`${store.curSongInfo.name} - ${artistNames}`">
        {{ store.curSongInfo.name }} - {{ artistNames }}
      </div>
      <!-- 歌曲详情页 -->
      <el-drawer
        v-model="store.showSongDetails"
        :with-header="false"
        direction="btt"
        :append-to-body="true"
        :size="'100%'"
      >
        <PlayDetails />
      </el-drawer>
    </div>
    <!-- 歌曲控制 -->
    <div class="center">
      <PlayerControl />
    </div>
    <!-- 播放列表 -->
    <div class="right">
      <div class="playlist" @click="store.showPlaylist = !store.showPlaylist">
        <el-badge :value="store.playlist.length">
          <IconPlaylist />
        </el-badge>
        <!-- 抽屉 -->
        <el-drawer
          v-model="store.showPlaylist"
          :with-header="false"
          :append-to-body="true"
          :size="520"
        >
          <Playlist />
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player.ts'
import Playlist from './components/SongList.vue'
import PlayDetails from './components/SongDetail.vue'
import PlayerControl from './components/PlayerControl.vue'
import { ElDrawer } from 'element-plus'
import IconPlaylist from '@/assets/icon/IconPlaylist.vue'
import { useBgColorStore } from '@/stores/bgColor.ts'
import { formatArtists } from '@/utils/format.ts'

const store = usePlayerStore()
const bgColorStore = useBgColorStore()

// 多歌手拼接展示，ar 为空时兜底，避免模板报错
const artistNames = computed(() => formatArtists(store.curSongInfo?.ar))
</script>

<style lang="less">
.player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 70px;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #ccc;
  z-index: 9999 !important;
  padding: 0.5rem 1rem;
  cursor: default;

  .left {
    width: 50%;
    display: flex;
    align-items: center;
    cursor: pointer;

    .el-image {
      height: 3rem;
      width: 3rem;
      border-radius: 0.5rem;
      margin-right: 1rem;
    }

    .name {
      color: #606226;
      font-size: 0.875rem;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .center {
    // 绝对定位固定在水平正中间，不参与左右两侧的 flex 布局
    // 必须给固定宽度，否则内部 60% 宽的 .playerControl 会因父级 width:auto 而塌陷
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .right {
    width: 50%;
    display: flex;
    align-items: center;
    padding-left: 6rem;

    .playlist {
      cursor: pointer;
      position: absolute;
      right: 2.5rem;

      .el-badge svg {
        font-size: 20px;
      }
    }
  }
}
</style>
