// ==================== 通用实体类型 ====================
// 以下类型对应网易云音乐 API 返回的核心实体，被多个 API 模块共享使用。

/**
 * 歌手/艺术家
 *
 * 使用场景：歌曲的演唱者、专辑的创作者、MV 的参演者、搜索结果中的歌手等。
 */
export interface ArtistType {
  /** 歌手唯一标识 */
  id: number
  /** 歌手名称 */
  name: string
  /** 歌手头像 */
  picUrl?: string
  /** 歌手方形头像，部分接口（如 MV 详情）返回 */
  img1v1Url?: string
}

/**
 * 专辑
 *
 * 使用场景：歌曲所属专辑、搜索结果中的专辑、歌手的所有专辑等。
 */
export interface AlbumType {
  /** 专辑唯一标识 */
  id: number
  /** 专辑名称 */
  name: string
  /** 专辑封面图片，部分接口返回 */
  picUrl?: string
  /** 专辑高斯模糊封面，用于背景展示 */
  blurPicUrl?: string
}

/**
 * 歌单/专辑卡片列表项（CPlaylist 组件）
 *
 * 使用场景：CPlaylist 组件展示歌单/专辑卡片列表时所需的最小字段。
 * 歌单（PlaylistType）和专辑（AlbumType）均满足此结构，可直接传入。
 */
export interface PlaylistCardType {
  /** 歌单/专辑唯一标识 */
  id: number
  /** 歌单/专辑名称 */
  name: string
  /** 封面图，专辑接口通常直接返回 picUrl */
  picUrl?: string
  /** 播放次数，专辑数据可能不返回 */
  playCount?: number
}

/**
 * 歌曲
 *
 * 使用场景：歌单中的曲目、搜索结果中的歌曲、每日推荐等。
 * 表格行索引 `index` 由 CSonglist 组件在渲染时动态注入。
 */
export interface SongType {
  /** 歌曲唯一标识 */
  id: number
  /** 歌曲名称 */
  name: string
  /** 歌手列表（一首歌可能有多个演唱者） */
  ar: ArtistType[]
  /** 所属专辑信息 */
  al: AlbumType
  /** 歌曲时长（毫秒） */
  dt: number
  /** 表格行索引，由 CSonglist 组件渲染时注入 */
  index?: number
  /** 关联的 MV id，无 MV 则为 0 或 undefined */
  mv?: number
}

/**
 * 评论
 *
 * 使用场景：歌曲、歌单、专辑、MV 的评论列表。
 * `hotComments` 为热门评论，`comments` 为最新评论。
 */
export interface CommentType {
  /** 评论唯一标识 */
  commentId: number
  /** 评论发布者信息 */
  user: {
    userId: number
    nickname: string
    avatarUrl: string
  }
  /** 评论正文 */
  content: string
  /** 评论发布时间（格式化后的字符串，如 "2024-01-01 12:00"） */
  timeStr: string
}

/**
 * 歌单
 *
 * 使用场景：推荐歌单、用户创建/收藏的歌单、搜索结果中的歌单等。
 * `picUrl` 由消费端补充（赋值为 coverImgUrl），用于兼容 CPlaylist 组件。
 */
export interface PlaylistType {
  /** 歌单唯一标识 */
  id: number
  /** 歌单名称 */
  name: string
  /** 歌单封面图片 */
  coverImgUrl: string
  /** 歌单封面（消费端适配 CPlaylist 组件时由 coverImgUrl 赋值） */
  picUrl?: string
  /** 歌单创建者信息 */
  creator: {
    userId: number
    nickname: string
    /** 创建者背景图 */
    backgroundUrl?: string
    /** 创建者头像 */
    avatarUrl?: string
  }
  /** 歌曲总数 */
  trackCount: number
  /** 播放次数 */
  playCount: number
  /** 歌单简介/描述 */
  description: string
  /** 创建时间（Unix 时间戳，毫秒） */
  createTime: number
  /** 当前用户是否已收藏 */
  subscribed: boolean
  /** 歌曲 ID 列表（仅含 id，不含完整歌曲信息） */
  trackIds: Array<{ id: number }>
  /** 完整歌曲列表，部分接口返回 */
  tracks?: SongType[]
}

/**
 * MV（音乐视频）
 *
 * 使用场景：MV 列表、搜索结果的 MV、相关推荐 MV、歌手 MV 等。
 * `imgurl` 字段由消费端映射为 `cover` 使用。
 */
export interface MVType {
  /** MV 唯一标识 */
  id: number
  /** MV 名称/标题 */
  name: string
  /** MV 封面图 */
  cover: string
  /** MV 封面图（部分接口使用此字段，消费端会映射到 cover） */
  imgurl?: string
  /** 参演艺人的歌手列表 */
  artists: ArtistType[]
  /** 播放次数 */
  playCount: number
  /** 发布时间（格式化字符串） */
  publishTime: string
  /** 视频时长（毫秒） */
  duration?: number
}

/**
 * 视频/MV 列表项
 *
 * 使用场景：MV 列表、搜索结果中的 MV 等列表卡片展示（CMVList 组件）。
 * 字段与 MVType 兼容，MV 接口返回的数据可直接复用。
 */
export interface VideoType {
  /** 视频唯一标识 */
  id: number
  /** 视频名称/标题 */
  name: string
  /** 视频封面图 */
  cover: string
  /** 播放次数，部分接口可能不返回 */
  playCount?: number
}

/**
 * Banner 轮播图
 *
 * 使用场景：发现页顶部的轮播广告位。
 * `targetType` 决定点击后的行为：1000=歌单，10=专辑，1=新歌首发（直接播放该歌曲）。
 */
export interface BannerType {
  /** 图片地址 */
  imageUrl: string
  /** 跳转目标类型：1000=歌单，10=专辑，1=新歌首发 */
  targetType: number
  /** 跳转目标 id（新歌首发时为歌曲 id） */
  targetId: number
}

/**
 * 标签
 *
 * 使用场景：歌单分类标签、MV 分类标签等。
 */
export interface TagType {
  /** 标签名称 */
  name: string
  /** 标签 id */
  id?: number
  /** 标签 key（部分接口使用） */
  key?: string | number
}

/**
 * 榜单项目
 *
 * 使用场景：所有榜单列表中的每一项（官方榜、全球榜）。
 */
export interface ToplistItemType {
  /** 榜单唯一标识 */
  id: number
  /** 榜单名称 */
  name: string
  /** 榜单封面图 */
  coverImgUrl: string
  /** 榜单内前几首代表性歌曲（仅含歌名和歌手名） */
  tracks: Array<{
    /** 歌曲名 */
    first: string
    /** 歌手名 */
    second: string
  }>
}

/**
 * 用户信息（个人主页）
 *
 * 使用场景：用户详情页、登录后获取的账户信息。
 */
export interface UserProfileType {
  /** 用户唯一标识 */
  userId: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatarUrl: string
  /** 用户等级 */
  level?: number
  /** 动态数量 */
  eventCount?: number
  /** 关注数 */
  follows?: number
  /** 粉丝数 */
  followeds?: number
  /** 个人简介/签名 */
  signature?: string
  /** 个人主页背景图 */
  backgroundUrl?: string
}

/**
 * 关注/粉丝用户
 *
 * 使用场景：用户关注列表、用户粉丝列表。
 * 字段较 UserProfileType 精简，仅包含列表展示所需信息。
 */
export interface FollowUserType {
  /** 用户唯一标识 */
  userId: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatarUrl: string
  /** 个人简介 */
  signature?: string
  /** 性别：0=未知，1=男，2=女 */
  gender?: number
  /** 粉丝数 */
  followeds?: number
  /** 关注数 */
  follows?: number
}
