<template>
  <div class="login">
    <!-- 二维码扫码登录 -->
    <div class="px-2.5 h-80 flex flex-col items-center">
      <div class="text-xl text-black text-center">扫码登录</div>

      <!-- 扫码图片部分 -->
      <div
        v-show="QRCodeStateCode === 0 || QRCodeStateCode === 800 || QRCodeStateCode === 801"
        class="flex flex-col items-center"
      >
        <!-- 二维码 -->
        <div class="h-52 w-52 [&_img]:w-full">
          <img :src="QRCodeBase" alt="" />
          <!-- 提示内容 -->
          <p class="whitespace-normal text-center leading-[25px] text-base">
            使用网易云音乐App扫码登录
          </p>
        </div>
      </div>

      <!-- 二维码失效刷新 -->
      <div v-show="QRCodeStateCode === 800" class="absolute bottom-4 left-4 text-sm">
        <el-button type="danger" size="small" @click="updateQRCode">刷新二维码</el-button>
      </div>

      <!-- 扫码确认待确认 -->
      <div v-show="QRCodeStateCode === 802" class="flex flex-col items-center gap-4 mt-40">
        <p class="text-base text-gray-500 text-l">请在手机上确认登录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getQRCodeKeyApi, getQRCodeBaseApi, checkQRCodeStateApi } from '@/api/login'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  loginDialogIsVisible: {
    type: Boolean,
    default: false
  },
  closeDialog: {
    type: Function,
    default: () => {}
  }
})

watch(
  () => props.loginDialogIsVisible,
  () => {
    if (!props.loginDialogIsVisible) {
      clearCheckTimer()
    } else {
      toQRCodeLogin()
    }
  }
)

// 二维码的Base64值
const QRCodeBase = ref('')
// 二维码的状态值
const QRCodeState = ref({})
// 二维码的状态码
const QRCodeStateCode = ref(0)
// 监测二维码状态的定时器
let checkTimer: ReturnType<typeof setInterval> | undefined = undefined
// 清除监测二维码状态的定时器
function clearCheckTimer() {
  if (checkTimer) {
    clearInterval(checkTimer)
    checkTimer = undefined
  }
}

//二维码登录
async function toQRCodeLogin() {
  // 先生成二维码key值
  const key = await getQRCodeKey()
  // 通过key获取二维码的 base64 编码
  await getQRCodeBase(key)
  // 防抖,如果定时器存在，则先清除定时器
  if (checkTimer) {
    clearCheckTimer()
  }
  // 开启定时器，定时检测二维码的扫描状态
  checkTimer = setInterval(async () => {
    await checkQRCodeState(key)
  }, 1200)
}

onMounted(async () => {
  toQRCodeLogin()
})

// 获取二维码key值
async function getQRCodeKey() {
  const res = await getQRCodeKeyApi()
  return res.data.unikey
}

// 生成二维码Base值
async function getQRCodeBase(key: string) {
  // 每次重新获取二维码时，将二维码的状态值重置
  QRCodeState.value = {}
  QRCodeStateCode.value = 0
  // 通过key获取二维码的 base64 编码
  const res = await getQRCodeBaseApi(key)
  QRCodeBase.value = res.data.qrimg
}

/** 检测二维码扫描状态 */
async function checkQRCodeState(key: string) {
  const res = await checkQRCodeStateApi(key)
  // 如果状态码改变了
  if (res.code !== QRCodeStateCode.value) {
    console.log(res)
    if (res.code === 800) {
      clearCheckTimer()
      ElMessage.warning('二维码已过期')
    } else if (res.code === 802) {
      ElMessage.success('扫码成功，请确认是否登录')
    } else if (res.code === 803 && res.cookie) {
      clearCheckTimer()
      // 将获取到的 cookie 保存在 localStorage 中
      localStorage.setItem('cookie', res.cookie)
      ElMessage.success('登录成功')
      props.closeDialog()
      // 刷新页面
      router.go(0)
    }
    // 储存新的状态码状态码和状态值
    QRCodeStateCode.value = res.code
    QRCodeState.value = res
  }
}

// 刷新二维码
function updateQRCode() {
  toQRCodeLogin().then(() => ElMessage.success('刷新成功！'))
}
</script>
