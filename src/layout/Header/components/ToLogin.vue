<template>
  <div class="toLogin flex [--el-message-close-size:24px]">
    <!-- 未登录时展示 -->
    <div v-if="!cookie" class="clickLogin ml-auto flex cursor-pointer items-center justify-center">
      <span @click="loginDialogIsVisible = true">登录</span>
    </div>
    <!-- 登录时展示 -->
    <div
      v-if="cookie"
      class="userInfo ml-auto flex cursor-pointer items-center justify-center"
      @click="toUserDetails"
    >
      <!-- 用户头像 -->
      <img
        :src="accountInfo.avatarUrl"
        alt=""
        class="mx-[10px] w-10 cursor-pointer rounded-full align-middle"
      />
      <!-- 用户名称 -->
      <!-- <span class="font-['等线'] text-[15px] text-black">{{ accountInfo.nickname }}</span> -->
      <!-- 退出登录 -->
      <div class="quit mx-5 flex items-center justify-center" v-if="cookie">
        <el-button
          :icon="SwitchButton"
          circle
          size="large"
          class="!border-0 !bg-[#ddd]"
          @click="quitDialogIsVisible = true"
        />
      </div>
    </div>
    <!-- 登录页面弹窗 -->
    <el-dialog
      v-model="loginDialogIsVisible"
      width="30%"
      :modal="false"
      :center="true"
      :draggable="true"
      top="10vh"
      @close="closeDialog"
    >
      <Login
        :loginDialogIsVisible="loginDialogIsVisible"
        :closeDialog="closeDialog"
        ref="loginRef"
      ></Login>
    </el-dialog>
  </div>

  <!-- 退出登录弹窗 -->
  <el-dialog
    v-model="quitDialogIsVisible"
    title="退出登录"
    width="250px"
    :center="true"
    :modal="false"
    :draggable="true"
  >
    <span class="quitHint mx-[60px]">是否退出登录？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="toLogout">确定</el-button>
        <el-button @click="quitDialogIsVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getAccountInfoApi, logoutApi } from '@/api/login'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import Login from '@/components/Login/index.vue'

const userStore = useUserStore()

const loginDialogIsVisible = ref(false)
const quitDialogIsVisible = ref(false)

// 处理弹窗关闭事件
function closeDialog() {
  loginDialogIsVisible.value = false
}

/** 退出登录 */
async function toLogout() {
  const res = await logoutApi()
  console.log(res)
  if (res.code === 200) {
    ElMessage.success('已退出登录')
    // 清空cookie token
    localStorage.removeItem('cookie')
    localStorage.removeItem('token')
    // 关闭弹窗
    quitDialogIsVisible.value = false
  }
  // 刷新页面
  router.go(0)
}

// 账户信息
const accountInfo = ref({ avatarUrl: '', nickname: '' })

const cookie = computed(() => {
  return localStorage.getItem('cookie')
})

async function getAccountInfo() {
  if (!localStorage.getItem('cookie')) {
    return
  }
  const res = await getAccountInfoApi()
  if (res.profile === null) {
    await logoutApi()
    localStorage.removeItem('cookie')
    localStorage.removeItem('token')
    ElMessage.warning('登录异常,已退出登录！')
    return
  }
  accountInfo.value = res.profile
  userStore.uid = res.profile.userId
  userStore.getUserData()
}

function toUserDetails() {
  router.push({
    name: 'myMusic'
  })
}

onMounted(() => {
  getAccountInfo()
})
</script>
