<template>
  <div ref="playerRef" id="xgplayer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const props = defineProps({
  // 视频源列表 (支持清晰度切换)
  sources: {
    type: Array as () => { definition: string; url: string }[],
    default: () => []
  },
  // 封面图
  poster: {
    type: String,
    default: ''
  },
  // 自动播放
  autoplay: {
    type: Boolean,
    default: false
  },
  // 宽度
  width: {
    type: String,
    default: '100%'
  },
  // 高度 (如果不传，xgplayer 会根据视频比例自适应，或默认为 fluid 模式)
  height: {
    type: String,
    default: 'fluid'
  }
})

const playerRef = ref<HTMLElement | null>(null)
const playerInstance = ref<Player | null>(null)

// 初始化播放器
const initPlayer = () => {
  // 确保有 DOM 且有有效的视频源
  // 过滤掉 url 为空的项 (父组件初始数据 url 可能为空字符串)
  const validSources = props.sources.filter((item) => item.url && item.url !== '')

  if (!playerRef.value || validSources.length === 0) return

  // 销毁旧实例，防止重复创建
  if (playerInstance.value) {
    playerInstance.value.destroy()
    playerInstance.value = null
  }

  // 默认使用列表中的第一个作为当前播放源
  const currentUrl = validSources[0].url

  playerInstance.value = new Player({
    el: playerRef.value,
    url: currentUrl,
    poster: props.poster,
    autoplay: props.autoplay,
    // 样式配置
    width: props.width,
    height: props.height,
    fluid: true, // 流体布局，宽度自适应，高度随比例
    fitVideoSize: 'fixWidth',

    // 功能配置
    lang: 'zh-cn',
    volume: 0.6, // 默认音量

    // 倍速配置
    playbackRate: [0.5, 0.75, 1, 1.25, 1.5, 2],

    // 清晰度切换配置
    definition: {
      list: validSources,
      defaultDefinition: 0, // 默认选中第0个
      isShowAll: true // 显示所有清晰度
    },

    pip: true // 画中画
  })
}

// 监听 sources 变化
// 原因：父组件是异步获取数据，初始化时 url 可能为空，获取到数据后需要重新初始化播放器
watch(
  () => props.sources,
  (newVal) => {
    // 检查是否所有 url 都为空（初始状态），如果是则不初始化
    const hasUrl = newVal.some((item) => item.url)
    if (hasUrl) {
      nextTick(() => {
        initPlayer()
      })
    }
  },
  { deep: true }
)

onMounted(() => {
  // 如果挂载时已经有url，直接初始化，some是对数组进行遍历，全满足条件才返回true
  if (props.sources.some((item) => item.url)) {
    initPlayer()
  }
})

onUnmounted(() => {
  if (playerInstance.value) {
    playerInstance.value.destroy()
    playerInstance.value = null
  }
})
</script>
