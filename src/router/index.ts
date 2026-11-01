import { createRouter, createWebHashHistory } from 'vue-router'
import Discover from '@/pages/Discover/index.vue'
const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    //重定向：在项目运行的时候，立马定向到发现音乐页面
    {
      path: '/',
      redirect: '/discover/recommend'
    },
    // 发现页
    {
      path: '/discover',
      name: 'discovery',
      component: Discover,
      redirect: '/discover/recommend',
      children: [
        {
          path: '/discover/recommend',
          component: () => import('@/pages/Discover/components/Recommend.vue'),
          name: 'recommend'
        },
        {
          path: '/discover/discoverPlaylist',
          component: () => import('@/pages/Discover/components/DiscoverPlaylist.vue'),
          name: 'discoverPlaylist'
        },
        {
          path: '/discover/rank',
          component: () => import('@/pages/Discover/components/Rank.vue'),
          name: 'rank'
        },
        {
          path: '/discover/discoverSinger',
          component: () => import('@/pages/Discover/components/DiscoverSinger.vue'),
          name: 'discoverSinger'
        }
      ]
    },
    // 歌单详情页
    {
      path: '/playlistDetails/:id',
      component: () => import('@/pages/PlaylistDetails/index.vue'),
      name: 'playlistDetails'
    },
    // 专辑详情页
    {
      path: '/albumDetails/:id',
      component: () => import('@/pages/AlbumDetails/index.vue'),
      name: 'albumDetails'
    },
    // 歌手详情页
    {
      path: '/singerDetails/:id',
      component: () => import('@/pages/SingerDetails/index.vue'),
      name: 'singerDetails'
    },
    // 搜索模块
    {
      path: '/search',
      component: () => import('@/pages/Search/index.vue'),
      redirect: '/search/songs',
      children: [
        // 搜索单曲
        {
          path: '/search/songs/:keywords',
          component: () => import('@/pages/Search/SSongs.vue'),
          name: 'searchSongs'
        },
        // 搜索歌手
        {
          path: '/search/singer/:keywords',
          component: () => import('@/pages/Search/SSinger.vue'),
          name: 'searchSinger'
        },
        // 搜索歌单
        {
          path: '/search/playlist/:keywords',
          component: () => import('@/pages/Search/SPlaylist.vue'),
          name: 'searchPlaylist'
        },
        // 搜索专辑
        {
          path: '/search/album/:keywords',
          component: () => import('@/pages/Search/SAlbum.vue'),
          name: 'searchAlbum'
        },
        // 搜索MV
        {
          path: '/search/mv/:keywords',
          component: () => import('@/pages/Search/SMV.vue'),
          name: 'searchMV'
        }
      ]
    },
    // MV视频
    {
      path: '/video',
      component: () => import('@/pages/MV/index.vue'),
      name: 'video'
    },
    // 视频详情页
    {
      path: '/videoDtails/:id',
      component: () => import('@/pages/MVDetails/index.vue'),
      name: 'videoDetails'
    },
    // 用户详情页
    {
      path: '/userDetails/:id',
      component: () => import('@/pages/UserDetails/index.vue'),
      name: 'userDetails'
    },
    // 关注列表
    {
      path: '/userDetails/follows/:id',
      component: () => import('@/pages/UserDetails/Follows.vue'),
      name: 'follows'
    },
    // 粉丝列表
    {
      path: '/userDetails/followeds/:id',
      component: () => import('@/pages/UserDetails/Followeds.vue'),
      name: 'followeds'
    }
  ]
})

export default router
