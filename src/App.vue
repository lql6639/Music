<script setup lang="ts">
import { watch } from 'vue'
import LayoutMain from './layout/LayoutMain.vue'
import { usePlayerStore } from './stores/player'

import config from '@/../package.json'

const store = usePlayerStore()

// 设置 title：正在播放的音乐优先（localStorage 有写入时用歌名），否则用原 title
const PLAYING_TITLE_KEY = 'title'
const defaultTitle = document.title

const getBaseTitle = () => {
  try {
    return localStorage.getItem(PLAYING_TITLE_KEY) || defaultTitle
  } catch {
    return defaultTitle
  }
}

let time = setTimeout(function () {
  document.title = getBaseTitle()
}, 800)

document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    document.title = '离开...'
    clearTimeout(time)
  } else {
    document.title = '在线...'
    time = setTimeout(function () {
      document.title = getBaseTitle()
    }, 3000)
  }
})

// 播放状态或歌曲切换时，实时更新标签页标题
watch([() => store.isPlaying, () => store.curSongInfo], () => {
  clearTimeout(time)
  document.title = getBaseTitle()
})

// 控制台输出
const styleTitle1 = 'font-size: 20px;font-weight: 600;color: rgb(244,167,89);'
const styleTitle2 = 'font-size:12px;color: rgb(244,167,89);'
const styleContent = 'color: rgb(30,152,255);'
const title1 = 'Lovlin_0206 の Music'
const title2 = `
__  __  _  _____  _____  _   _   ____
|  \\/  |(_)|  ___|| ____|| \\ | | / ___|
| |\\/| || || |_   |  _|  |  \\| || |  _
| |  | || ||  _|  | |___ | |\\  || |_| |
|_|  |_||_||_|    |_____||_| \\_| \\____|`
const content = `\n\n版本: ${config.version}\nAuthor: ${config.author} & Github: ${config.AuthorGithub}`
console.info(`%c${title1} %c${title2} %c${content}`, styleTitle1, styleTitle2, styleContent)
</script>

<template>
  <LayoutMain />
</template>

<style></style>
