import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getColor, type Color } from 'colorthief'

/** 主内容区默认背景色 */
export const MAIN_BG_DEFAULT = '#f7f9fc'

export const useBgColorStore = defineStore('bgColor', () => {
  /** 主内容区背景色，由详情页根据封面主题色动态设置 */
  const bgColor = ref(MAIN_BG_DEFAULT)

  /**
   * 根据封面图/主题色设置主内容背景色
   * - 传入 HTMLImageElement：自动提取主色（需图片加载完成）
   * - 传入 Color：直接使用已提取的颜色
   * 统一做浅色化处理，保证主内容区上方文字可读
   */
  const setMainBg = async (source: HTMLImageElement | Color) => {
    let color: Color | null
    if (source instanceof HTMLImageElement) {
      color = await getColor(source)
    } else {
      color = source
    }
    if (!color) {
      return
    }
    const { r, g, b } = color.rgb()
    // 浅色化：混合 85% 白色，保证上方文字可读
    const l = (v: number) => Math.round(v * 0.15 + 255 * 0.85)
    bgColor.value = `rgb(${l(r)},${l(g)},${l(b)})`
  }

  /** 恢复默认背景色 */
  const resetBgColor = () => {
    bgColor.value = MAIN_BG_DEFAULT
  }

  return {
    bgColor,
    setMainBg,
    resetBgColor
  }
})
