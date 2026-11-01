<template>
  <div class="discover" style="margin-top: -18px">
    <!-- 选择标签 -->
    <Tabs :tabs="tabs" />
    <!-- Vue3中的 keep-alive让路由组件不被销毁使用方式的变化 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs/index.vue'

const tabs = [
  {
    label: '个性推荐',
    name: 'recommend',
    path: '/discover/recommend'
  },
  {
    label: '发现歌单',
    name: 'discoverPlaylist',
    path: '/discover/discoverPlaylist'
  },
  {
    label: '排行榜',
    name: 'rank',
    path: '/discover/rank'
  },
  {
    label: '发现歌手',
    name: 'discoverSinger',
    path: '/discover/discoverSinger'
  }
]
</script>
