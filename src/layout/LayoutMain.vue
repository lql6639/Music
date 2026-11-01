<template>
  <div
    class="w-screen h-screen flex overflow-hidden"
    :style="{ backgroundColor: bgColorStore.bgColor || '#ffffff' }"
  >
    <!-- 左侧 aside -->
    <aside class="w-48 shrink-0 h-full overflow-y-auto border-r border-[#ccc]">
      <Aside />
    </aside>

    <!-- 右侧：header + main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main ref="mainRef" class="flex-1 overflow-y-auto p-6 pb-24 transition-colors duration-500">
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- 回到顶部按钮 -->
    <el-backtop :target="mainRef" :bottom="120"></el-backtop>

    <!-- 底部播放器：自身 fixed 定位 + 高 z-index，直接挂在布局根节点下，始终位于内容之上 -->
    <FootPlayer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header/index.vue'
import Aside from './Aside/index.vue'
import FootPlayer from './FootPlayer/index.vue'
import { useRoute } from 'vue-router'
import { useBgColorStore } from '@/stores/bgColor'
const route = useRoute()
const mainRef = ref<HTMLElement>()

/** 动态背景色，供子页面（如歌单详情）设置 */
const bgColorStore = useBgColorStore()
</script>
