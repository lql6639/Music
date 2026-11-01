<template>
  <el-tabs v-model="currentName" @tab-click="handleClick">
    <!-- 循环遍历主内容区导航分类的内容 -->
    <el-tab-pane v-for="(t, index) in tabs" :key="index" :label="t.label" :name="t.name" />
  </el-tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const { tabs } = defineProps<{
  tabs: Array<{
    label: string
    name: string
  }>
}>()

// 定义变量 name用来保存当前页面的路径
const currentName = computed({
  get() {
    return route.name
  },
  set(val) {
    return val
  }
})

function handleClick(tab: { index: number }) {
  router.push({ name: tabs[tab.index].name })
}
</script>

<style lang="less">
.el-tabs {
  .el-tabs__nav-wrap {
    .el-tabs__item {
      font-size: 16px;
    }

    .el-tabs__active-bar {
      background-color: #e13e3e;
      height: 0.2rem;
    }

    .is-active {
      font-weight: bolder;
      color: black;
    }

    &::after {
      background-color: transparent;
    }
  }
}
</style>
