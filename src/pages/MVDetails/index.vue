<template>
  <!-- 视频详情页 -->
  <div class="flex flex-col w-full" v-loading="isLoading">
    <div class="text-lg font-semibold mb-2.5">视频详情</div>

    <!-- 视频 + 信息：左右布局 -->
    <div class="flex gap-6">
      <!-- 左侧：视频播放区域 -->
      <div class="flex-shrink-0 w-[800px]">
        <VideoPlayer
          width="100%"
          :poster="videoDetails.cover"
          :sources="sources"
          :autoplay="false"
        />
      </div>

      <!-- 右侧：视频信息 -->
      <div class="flex flex-col flex-1 min-w-0">
        <!-- 标题 -->
        <div class="text-xl font-semibold mb-4">{{ videoDetails.name }}</div>
        <div class="text-xs font-light mb-8 line-clamp-4">
          {{ videoDetails.desc || '暂无描述' }}
        </div>

        <!-- 作者 -->
        <div class="flex flex-wrap mb-4">
          <div
            class="flex items-center mr-4 cursor-pointer"
            v-for="ar in videoDetails.artists"
            :key="ar.id"
            @click="toSingerDetails(ar.id)"
          >
            <img :src="ar.img1v1Url" alt="" class="w-10 h-10 rounded-full" />
            <span class="ml-2 text-gray-600 text-sm">{{ ar.name }}</span>
          </div>
        </div>

        <!-- 发布日期 / 播放量 -->
        <div class="mb-4">
          <span class="mr-8 text-sm text-gray-500">发布：{{ videoDetails.publishTime }}</span>
          <span class="text-sm text-gray-500"
            >播放量：{{ (videoDetails.playCount / 10000).toFixed(1) }}w</span
          >
        </div>

        <!-- 操作按钮 -->
        <div class="flex">
          <div
            class="flex items-center border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
          >
            <IconLike class="mr-1" />赞
          </div>
          <div
            class="flex items-center border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
          >
            <IconCollect class="mr-1" />收藏
          </div>
        </div>
      </div>
    </div>

    <!-- MV评论 -->
    <CComments :type="'mv'" :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mvDetailsApi, mvUrlApi, type MVDetailsResponse } from '@/api/mv'
import CComments from '@/components/common/CComments.vue'
import IconLike from '@/assets/icon/IconLike.vue'
import IconCollect from '@/assets/icon/IconCollect.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id)
const isLoading = ref(true)

/** 视频详细信息 */
const videoDetails = ref<MVDetailsResponse['data']>({
  name: '',
  desc: '',
  cover: '',
  artists: [],
  publishTime: '',
  playCount: 0
})

/** 视频清晰度资源url列表 */
const sources = ref<Array<{ definition: string; url: string }>>([
  { definition: '1080P', url: '' },
  { definition: '720P', url: '' },
  { definition: '480P', url: '' }
])

async function getData() {
  isLoading.value = true
  const [details, urlRes1080, urlRes720, urlRes480] = await Promise.all([
    mvDetailsApi(id.value),
    mvUrlApi(id.value, 1080),
    mvUrlApi(id.value, 720),
    mvUrlApi(id.value, 480)
  ])
  videoDetails.value = details.data
  sources.value = [
    { definition: '1080P', url: urlRes1080.data.url },
    { definition: '720P', url: urlRes720.data.url },
    { definition: '480P', url: urlRes480.data.url }
  ]
  console.log(sources.value)
  isLoading.value = false
}

function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id }
  })
}

onMounted(() => {
  getData()
})
</script>
