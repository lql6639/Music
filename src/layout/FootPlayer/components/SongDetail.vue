<template>
  <!-- 歌曲详情页 -->
  <div class="playDetails">
    <div class="details">
      <!-- 收起抽屉 -->
      <el-icon class="packUp" @click="store.showSongDetails = false">
        <ArrowDownBold />
      </el-icon>
      <!-- 歌曲信息和图片 -->
      <div class="left">
        <!-- 歌曲图片：播放时旋转，暂停时停住 -->
        <div class="songImage">
          <img
            :class="{ rotating: store.isPlaying }"
            :src="store.curSongInfo.al?.picUrl || ''"
            alt="歌曲封面"
          />
        </div>
        <!-- 歌曲信息 -->
        <div class="songInfo">
          <p class="name">{{ store.curSongInfo.name }}</p>
          <div class="author">
            <p v-for="ar in store.curSongInfo.ar" :key="ar.id">{{ ar.name }}</p>
          </div>
          <p class="album">{{ store.curSongInfo.al?.name || '' }}</p>
        </div>
      </div>
      <!-- 歌词部分 -->
      <div class="right">
        <div class="lyric" ref="lyric">
          <p
            v-for="(item, index) in store.lyric"
            :key="index"
            :class="{ active: store.curDuration >= item.time && store.curDuration <= item.next }"
          >
            {{ item.lrc }}
          </p>
        </div>
      </div>
    </div>
    <!-- 歌曲评论 -->
    <div class="comment" v-show="store.curSongInfo.id">
      <CComments :type="'song'" :id="store.curSongInfo.id" :key="store.curSongInfo.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { onMounted, onUnmounted, ref } from 'vue'
import CComments from '@/components/common/CComments.vue'
import { ArrowDownBold } from '@element-plus/icons-vue'

const store = usePlayerStore()

// 歌词
const lyric = ref()

let timer: number | undefined = undefined

// 歌词滚动逻辑
onMounted(() => {
  // 歌词滚动1s刷新一次
  timer = setInterval(() => {
    // 获取播放到的歌词元素，始终让它滚动到容器垂直居中的位置
    const p: any = document.querySelector('p.active')
    if (p && lyric.value) {
      // 长前奏时停在第一句也居中显示，不会顶在最上面
      lyric.value.scrollTo({
        top: p.offsetTop - lyric.value.clientHeight / 2,
        behavior: 'smooth'
      })
    }
  }, 1000)
})

// 销毁前破坏定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="less">
.playDetails {
  height: 100%;
  width: 100%;

  .details {
    width: 100%;
    height: 530px;
    display: flex;

    .el-icon {
      position: absolute;
      cursor: pointer;
      top: 1rem;
      left: 2rem;
      font-size: 24px;
      z-index: 1;
    }

    .left {
      width: 40%;
      height: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 3rem;

      .songImage {
        width: 280px;
        height: 280px;
        margin-bottom: 2rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          // 始终持有动画，通过 play-state 控制播放/暂停，暂停时保持当前角度不回弹
          animation: discRotate 20s linear infinite;
          animation-play-state: paused;

          &.rotating {
            animation-play-state: running;
          }
        }
      }

      .songInfo {
        width: 100%;
        text-align: center;
        padding: 0 2rem;

        .name {
          font-weight: 600;
          font-size: 24px;
          margin-bottom: 0.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .author {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 0.8rem;

          p {
            font-size: 16px;
            color: #666;
          }
        }

        .album {
          font-size: 14px;
          color: #999;
        }
      }
    }

    .right {
      width: 60%;
      height: 500px;
      padding: 3rem 2rem 0 0;

      .lyric {
        width: 100%;
        height: 450px;
        // 上下各留出半个容器高度的空白，保证第一句/最后一句也能滚动到垂直居中
        padding: 225px 0;
        text-align: center;
        // 作为歌词行的定位参照，p.offsetTop 才是相对滚动容器的
        position: relative;
        overflow-y: auto;

        p {
          margin-bottom: 1.5rem;
          font-size: 16px;
          line-height: 1.6;
          transition: all 0.3s ease;
        }

        .active {
          color: #ec4141;
          font-size: 18px;
          font-weight: 500;
        }
      }
    }
  }

  .comment {
    padding: 0 1.5rem;
  }
}

// 封面旋转动画
@keyframes discRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
