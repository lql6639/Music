<template>
  <!-- 歌曲控制 -->
  <div class="playerControl">
    <!-- 控制 -->
    <div class="control">
      <!-- 循环模式 -->
      <div class="cycleMode" @click="switchLoopMode">
        <IconLoop v-if="loopMode == 'loop'" />
        <IconRandom v-if="loopMode == 'random'" />
        <IconSingleLoop v-if="loopMode == 'cycle'" />
      </div>
      <!-- 收藏 -->
      <div class="love" v-if="false">
        <IconCollect />
      </div>
      <!-- 上一首 -->
      <div class="prev" @click="prevSong">
        <IconPrev />
      </div>
      <!-- 播放/暂停 -->
      <div class="isPlay" id="isPlay" @click="togglePlay">
        <IconPlay v-if="!store.isPlaying" />
        <IconPause v-else />
      </div>
      <!-- 下一首 -->
      <div class="next" @click="nextSong">
        <IconNext />
      </div>
      <!-- 音量控制 -->
      <div class="volume">
        <!-- 是否静音 -->
        <div class="mute" @click="toggleMute">
          <IconVolume v-if="!isMute" />
          <IconMute v-else />
        </div>
        <el-slider
          v-if="false"
          v-model="curVolume"
          @change="changeVolume"
          :show-tooltip="true"
          :max="100"
        ></el-slider>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="progressBar">
      <div class="curTime">{{ curTime }}</div>
      <el-slider
        v-model="sliderValue"
        :max="duration"
        @change="changeDuration"
        @mousedown="isDragging = true"
        :show-tooltip="false"
      />
      <div class="endTime">{{ endTime }}</div>
    </div>
    <!-- 播放音乐的核心组件 autoplay-->
    <audio
      ref="audioPlayer"
      :src="store.curSongUrl"
      @timeupdate="timeupdate"
      :autoplay="store.isPlaying"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { msToMinSeconed } from '@/utils/time'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import IconLoop from '@/assets/icon/IconLoop.vue'
import IconRandom from '@/assets/icon/IconRandom.vue'
import IconSingleLoop from '@/assets/icon/IconSingleLoop.vue'
import IconCollect from '@/assets/icon/IconCollect.vue'
import IconPrev from '@/assets/icon/IconPrev.vue'
import IconPlay from '@/assets/icon/IconPlay.vue'
import IconPause from '@/assets/icon/IconPause.vue'
import IconNext from '@/assets/icon/IconNext.vue'
import IconVolume from '@/assets/icon/IconVolume.vue'
import IconMute from '@/assets/icon/IconMute.vue'

const store = usePlayerStore()

// 控制audio的Ref
const audioPlayer = ref()
// 循环模式 loop random cycle（状态在 store 中，已持久化）
const loopMode = computed(() => store.loopMode)
// 拖动进度条标志（防止 timeupdate 覆盖用户操作）
const isDragging = ref(false)
// 本地滑块值，隔离 timeupdate 的覆盖
const sliderValue = ref(0)

// 当前时间 字符串（跟随滑块值，拖动时不会跳动）
const curTime = computed(() => {
  return msToMinSeconed(sliderValue.value)
})
// 总时间 毫秒
const duration = computed(() => {
  return store.curSongInfo.dt || 0
})
// 总时间 字符串
const endTime = computed(() => {
  return msToMinSeconed(duration.value)
})

// 切换循环模式
function switchLoopMode() {
  if (store.loopMode == 'loop') {
    store.loopMode = 'random'
    ElMessage.success('随机播放')
  } else if (store.loopMode == 'random') {
    store.loopMode = 'cycle'
    ElMessage.success('单曲循环')
  } else {
    store.loopMode = 'loop'
    ElMessage.success('循环播放')
  }
}

// 播放/暂停
async function togglePlay() {
  // 恢复历史播放列表后首次点播放：songUrl 还没加载，先请求再播放
  if (!store.curSongUrl && store.curSongInfo.id) {
    await store.updateCurSong()
    store.isPlaying = true
    audioPlayer.value.play()
    return
  }
  if (!store.curSongUrl) {
    ElMessage.warning('当前无音乐播放')
    return
  }
  store.isPlaying = !store.isPlaying
  if (store.isPlaying) {
    audioPlayer.value.play()
  } else {
    audioPlayer.value.pause()
  }
}

// 拖动进度条（松开滑块时触发）
function changeDuration(val: number) {
  isDragging.value = false
  // 如果有播放音乐
  if (store.curSongUrl) {
    store.curDuration = val
    sliderValue.value = val
    audioPlayer.value.currentTime = val / 1000
  } else {
    store.curDuration = 0
    sliderValue.value = 0
    ElMessage.warning('当前无音乐播放，无法进行操作')
  }
}

// 上一首
function prevSong() {
  // 顺序循环和单曲循环都是单位1
  if (loopMode.value == 'loop' || loopMode.value == 'cycle') {
    // 如果是第一首的上一首就是最后一首
    store.index = store.index == 0 ? store.playlist.length - 1 : store.index - 1
  } else if (loopMode.value == 'random') {
    store.index = Math.floor(Math.random() * store.playlist.length)
  }
  store.updateCurSong()
}

// 下一首
function nextSong() {
  if (loopMode.value == 'loop' || loopMode.value == 'cycle') {
    // 如果是最后一首的下一首就是第一首
    store.index = store.index == store.playlist.length - 1 ? 0 : store.index + 1
  } else if (loopMode.value == 'random') {
    store.index = Math.floor(Math.random() * store.playlist.length)
  }
  store.updateCurSong()
}

// 监听切换歌曲
watch(
  () => store.curSongUrl,
  (val, oldVal) => {
    // 切换的歌曲，更新为0, 且默认播放
    if (val != oldVal) {
      store.curDuration = 0
      sliderValue.value = 0
      isDragging.value = false
      store.isPlaying = true
    }
  }
)

// 是否静音控制
const isMute = ref(false)
// 当前音量大小 默认100
const curVolume = ref(100)

//切换是否静音
function toggleMute() {
  isMute.value = !isMute.value
  if (isMute.value) {
    ElMessage.success('开启静音')
  } else {
    ElMessage.warning('关闭静音')
  }
}
// 拖动音量进度条
function changeVolume(val: number) {
  curVolume.value = val
  audioPlayer.value.volume = val / 100
}
// 监听是否是静音
watch(
  () => isMute.value,
  () => {
    if (isMute.value) {
      audioPlayer.value.volume = 0
    } else {
      audioPlayer.value.volume = curVolume.value / 100
    }
  }
)

// 监听 store.curDuration 同步到本地滑块（拖动期间不同步）
watch(
  () => store.curDuration,
  (val) => {
    if (!isDragging.value) {
      sliderValue.value = val
    }
  }
)

// 播放音乐自动触发
function timeupdate(e: any) {
  // 拖动进度条时不更新，避免覆盖用户操作
  if (!isDragging.value) {
    store.curDuration = e.target.currentTime * 1000
  }

  // 判断歌曲是否为试听歌曲
  if (e.target.ended && curTime.value < endTime.value) {
    ElMessage.warning('VIP歌曲,试听结束！！！')
    // 暂停播放
    store.isPlaying = false
  }

  // 当歌曲播放完毕后，并根据歌曲的循环方式进行操作
  if (e.target.ended && curTime.value == endTime.value) {
    store.isPlaying = false
    if (loopMode.value == 'cycle') {
      // 单曲循环自动下一首还是本首
      e.target.currentTime = 0
      store.curDuration = 0
    } else {
      nextSong()
    }
  }
}
</script>

<style lang="less" scoped>
.playerControl {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .control {
    width: 66%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    div {
      cursor: pointer;

      svg {
        font-size: 20px;
      }
    }

    #isPlay i {
      font-size: 34px;
    }

    .volume {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 0.2rem;

      svg {
        font-size: 24px;
        margin-right: 0.6rem;
      }
    }
  }

  .progressBar {
    width: 100%;
    height: 40%;
    display: flex;
    align-items: center;

    .curTime,
    .endTime {
      font-size: 14px;
      margin: 0 24px;
      color: #888;
    }

    .el-slider {
      --el-slider-button-size: 8px;
    }
  }
}
</style>
