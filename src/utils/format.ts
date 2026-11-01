// 优化图片 URL，添加尺寸参数
export const optimizeImageUrl = (url: string | undefined, width = 200, height = 200): string => {
  if (!url) return ''
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}param=${width}y${height}`
}
// 歌手列表格式化，支持多歌手（用 / 连接），无歌手时返回占位文案
export const formatArtists = (
  ar: { name?: string }[] | null | undefined,
  fallback = '未知歌手'
): string => {
  if (!Array.isArray(ar)) return fallback
  const names = ar.map((item) => item?.name?.trim()).filter((name): name is string => !!name)
  return names.length ? names.join(' / ') : fallback
}

// 文案截断，超出长度补省略号
export const truncateText = (text: string | undefined | null, max = 24): string => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}...` : text
}

// 播放量格式化,千，万，亿，单位
export const formatPlayCount = (count: number) => {
  if (typeof count !== 'number' || count < 0) {
    return 'loading...'
  }

  const units = [
    { value: 100000000, suffix: '亿' },
    { value: 10000, suffix: 'w' },
    { value: 1000, suffix: 'k' }
  ]

  // 查找适用的最大单位
  const matchedUnit = units.find((unit) => count >= unit.value)

  if (matchedUnit) {
    const formattedValue = (count / matchedUnit.value).toFixed(1).replace(/\.0$/, '') // 移除无用的零
    return `${formattedValue}${matchedUnit.suffix}`
  }

  // 处理小于 1000 的情况
  return `${Math.floor(count)}`
}
