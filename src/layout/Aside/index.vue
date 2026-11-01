<template>
  <aside class="w-full h-full bg-transparent">
    <!-- logo -->
    <div class="flex items-center justify-center h-[60px] cursor-pointer logo-hover mx-6">
      <span class="text-2xl text-center font-bold">Music</span>
    </div>
    <!-- 菜单组件 -->
    <el-menu :default-active="activeMenu">
      <el-menu-item
        v-for="menu of menus"
        :key="menu.name"
        :index="menu.path"
        @click="selectMenu(menu)"
      >
        <!-- 图标 -->
        <component :is="iconMap[menu.icon]" />
        <!-- 菜单文字 -->
        <span>{{ menu.label }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import IconDiscover from '@/assets/icon/IconDiscover.vue'
import IconVideo from '@/assets/icon/IconVideo.vue'
import IconUser from '@/assets/icon/IconUser.vue'

const iconMap: Record<string, unknown> = {
  discover: IconDiscover,
  video: IconVideo,
  user: IconUser
}
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menus = [
  { name: 'discover', label: 'Find', icon: 'discover', path: '/discover/recommend' },
  { name: 'video', label: 'Video', icon: 'video', path: '/video' },
  { name: 'myMusic', label: 'User', icon: 'user', path: '/userDetails' }
]

// 动态计算当前激活的菜单
const activeMenu = computed(() => {
  if (route.path.startsWith('/discover')) return '/discover/recommend'
  if (route.path.startsWith(`/userDetails/${userStore.userInfo.userId}`)) return '/userDetails'
  return route.path // 直接返回当前路由路径
})

function selectMenu(menu: { path: string; name: string }) {
  if (menu.name == 'myMusic' && !localStorage.getItem('cookie')) {
    ElMessage.warning('你还没有登录，请先登录')
    return
  }
  // 登录用户的个人用户详情页
  if (menu.name == 'myMusic' && localStorage.getItem('cookie')) {
    router.push(menu.path + '/' + userStore.userInfo.userId)
    return
  }
  // 其他跳转
  router.push(menu.path)
}
</script>

<style lang="less">
.el-menu {
  width: 100%;
  border-right: none !important;
  background: transparent;

  .el-menu-item {
    height: 48px;
    line-height: 48px;
    color: #333;
    background-color: transparent;
    transition: background 0.2s ease;

    svg {
      margin-right: 12px;
      font-size: 18px;
    }

    span {
      font-size: 14px;
    }

    &:hover {
      background: #f5f5f5;
    }

    &.is-active {
      color: #e13e3e !important;
      background: #fde2e2;
      font-weight: 500;
      position: relative;
    }
  }
}
</style>
