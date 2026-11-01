import { getColor } from 'colorthief'

/**
 * 从已加载的 `<img>` 元素提取主题色并暗化，返回 rgb 字符串。
 * 配合 el-image 的 @load 事件使用，直接复用已显示的图片，无需二次下载。
 *
 * @example
 * // el-image @load 回调中：
 * const color = await extractColorFromImage(e.target as HTMLImageElement)
 */
export async function extractColorFromImage(img: HTMLImageElement): Promise<string> {
  try {
    const color = await getColor(img)
    if (!color) return ''
    const { r, g, b } = color.rgb()
    // 暗化 15%，保证上方白色文字可读
    const d = (v: number) => Math.round(v * 0.85)
    return `rgb(${d(r)},${d(g)},${d(b)})`
  } catch {
    return ''
  }
}
