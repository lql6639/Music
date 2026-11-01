<template>
  <!-- 歌手详情页 -->
  <div>
    <!-- 歌手信息 -->
    <div class="flex items-center pb-4 gap-4">
      <el-image
        :src="optimizeImageUrl(singerInfo.cover, 300, 300)"
        lazy
        crossorigin="anonymous"
        class="w-40 h-40 rounded-xl"
        @load="onMainBgChange"
      />
      <div class="ml-4">
        <div class="flex items-center mb-4">
          <span
            class="block h-6 w-16 text-[#ec4141] text-[15px] text-center border border-[#ec4141] rounded-[5px] mr-2"
            >歌手</span
          >
          <span class="text-2xl font-bold text-black">{{ singerInfo.name }}</span>
        </div>
        <div class="mb-4">
          <el-button type="danger" :plain="!subscribed" @click="toggleSubscribe"
            ><IconCollect class="mr-1" />{{ subscribed ? '取消关注' : '关注' }}</el-button
          >
        </div>
        <div class="relative right-4">
          <span class="ml-4 text-sm text-gray-500">单曲数：{{ singerInfo.musicSize }}</span>
          <span class="ml-4 text-sm text-gray-500">专辑数：{{ singerInfo.albumSize }}</span>
          <span class="ml-4 text-sm text-gray-500">MV数：{{ singerInfo.mvSize }}</span>
        </div>
      </div>
    </div>
    <!-- 歌曲、专辑、歌手详情 -->
    <el-tabs v-model="selectedTag" class="w-full h-full" v-loading="isLoading">
      <el-tab-pane label="热门歌曲" name="hotSongs">
        <div class="text-center text-xl font-semibold mb-4">热门歌曲50首</div>
        <CSonglist :songlist="songlist" />
      </el-tab-pane>
      <el-tab-pane label="专辑" name="album">
        <CPlaylist :playlists="albums" :type="'album'" />
      </el-tab-pane>
      <el-tab-pane label="MVType" name="mv">
        <CVideoList :video-data="mvlist" />
        <div class="flex justify-center p-2">
          <el-button color="#ed5736" plain @click="continueLoading">more...</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌手描述" name="descrip">
        <div class="text-sm text-[#373737] leading-6 tracking-[1px] indent-8">
          {{ singerInfo.briefDesc }}
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  singerDetailsApi,
  singerHotSongApi,
  singerAlbumApi,
  singerMVApi,
  singerSubscribeApi,
  singerUnsubscribeApi,
  type SingerDetailsResponse
} from '@/api/singer'
import CSonglist from '@/components/common/CSonglist.vue'
import CPlaylist from '@/components/common/CPlaylist.vue'
import IconCollect from '@/assets/icon/IconCollect.vue'
import CVideoList from '@/components/common/CMVList.vue'
import { ElMessage } from 'element-plus'
import { useBgColorStore } from '@/stores/bgColor'
import type { SongType, AlbumType, MVType } from '@/api/types'
import { optimizeImageUrl } from '@/utils/format'

const route = useRoute()
const bgColorStore = useBgColorStore()

const id = computed(() => route.params.id)

const isLoading = ref(true)
/** 选择的标签 */
const selectedTag = ref('hotSongs')

/** 歌手信息 */
const singerInfo = ref<SingerDetailsResponse['data']['artist']>({
  cover: '',
  name: '',
  musicSize: 0,
  albumSize: 0,
  mvSize: 0,
  briefDesc: ''
})

/** 歌手热门单曲 */
const songlist = ref<SongType[]>([])
/** 歌手专辑 */
const albums = ref<AlbumType[]>([])
/** 歌手MV列表 */
const mvlist = ref<MVType[]>([])
/** 歌手是否关注 */
const subscribed = ref(false)

/** 懒加载 */
const condition = reactive({
  count: 1,
  limit: 24,
  isMore: false
})

/** 获取数据 */
async function getData() {
  isLoading.value = true

  const [details, hotSongs, albumRes] = await Promise.all([
    singerDetailsApi(id.value),
    singerHotSongApi(id.value),
    singerAlbumApi(id.value)
  ])

  singerInfo.value = details.data.artist
  songlist.value = hotSongs.songs
  albums.value = albumRes.hotAlbums
  subscribed.value = details.data.user.followed

  isLoading.value = false

  getSingerMV()
}

/** 获取歌手 MV */
async function getSingerMV() {
  const mvRes = await singerMVApi(
    id.value,
    (condition.count - 1) * condition.limit,
    condition.limit
  )
  mvRes.mvs.forEach((item) => {
    item.cover = item.imgurl || item.cover
  })
  mvlist.value.push(...mvRes.mvs)
  condition.isMore = mvRes.hasMore
}

// 继续加载
async function continueLoading() {
  if (condition.isMore) {
    condition.count++
    getSingerMV()
  } else {
    ElMessage.warning('暂无更多数据!')
  }
}

// 关注或取消关注歌手
async function toggleSubscribe() {
  // 必须登录才能关注或取消关注
  if (!localStorage.getItem('cookie')) {
    ElMessage.warning('请先登录!')
    return
  }
  if (subscribed.value) {
    await singerUnsubscribeApi(id.value)
    // 不通过网络更新是减少请求次数
    subscribed.value = false
    ElMessage.success('取消关注, 有延迟')
  } else {
    await singerSubscribeApi(id.value)
    subscribed.value = true
    ElMessage.success('关注成功, 有延迟')
  }
}

onMounted(() => {
  getData()
})

// 封面图加载完成后提取主题色，动态设置全局背景色
async function onMainBgChange(e: Event) {
  await bgColorStore.setMainBg(e.target as HTMLImageElement)
}

onUnmounted(() => {
  bgColorStore.resetBgColor()
})
</script>
