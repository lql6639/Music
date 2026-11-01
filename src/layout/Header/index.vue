<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="relative z-[1000] flex h-[60px] w-full items-center px-10">
    <!-- 页面向前跳转 -->
    <div class="mr-3">
      <el-button
        :icon="ArrowLeft"
        circle
        class="!border-[#e5e7eb] !bg-transparent !text-[#333] transition-all duration-200 hover:!border-[#d1d5db] hover:!bg-[#f9fafb] [&_svg]:h-[1.2em] [&_svg]:w-[1.2em]"
        @click="router.back()"
      />
    </div>
    <!-- 搜索模块 -->
    <div class="mr-5 max-w-[400px] flex-1">
      <Search />
    </div>
    <!-- 登录模块 -->
    <div class="ml-auto">
      <ToLogin />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import Search from './components/Search.vue'
import ToLogin from './components/ToLogin.vue'

const router = useRouter()
</script>
