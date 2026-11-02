/**
 * 自动检测更新：
 * - 构建时 vite 生成 dist/version.json 并在 index.html 注入 <meta name="app-version">
 * - 每 30s 拉取一次 version.json（禁用缓存），与页面加载时的版本对比
 * - 发现新版本：清空 Local Storage / sessionStorage / Cache / Service Worker 后自动刷新
 */
const BUILD_VERSION =
  document.querySelector('meta[name="app-version"]')?.getAttribute('content') || ''

async function clearClientCache() {
  try {
    localStorage.clear()
    sessionStorage.clear()
  } catch {
    // 隐私模式下可能被禁用，忽略
  }
  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }
  if (navigator.serviceWorker) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((reg) => reg.unregister()))
  }
}

async function checkUpdate() {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return
    const data = (await res.json()) as { version?: string }
    if (data.version && BUILD_VERSION && data.version !== BUILD_VERSION) {
      await clearClientCache()
      window.location.reload()
    }
  } catch {
    // 网络异常时跳过本轮检测
  }
}

export function startCheckUpdate(intervalMs = 30_000) {
  if (!BUILD_VERSION) return
  setInterval(checkUpdate, intervalMs)
}
