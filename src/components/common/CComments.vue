<template>
  <!-- 封装评论组件 -->
  <div class="Comments">
    <!-- 热门评论 -->
    <div class="hot">
      <div class="title" v-if="hotComments.length">最热评论</div>
      <div class="item" v-for="comment in hotComments" :key="comment.commentId">
        <!-- 评论人 -->
        <div class="commenter" @click="toUserDetails(comment.user.userId)">
          <div class="avatar">
            <img :src="optimizeImageUrl(comment.user.avatarUrl, 50, 50)" alt="loading..." />
          </div>
          <div class="userInfo">
            <div class="nickname">{{ comment.user.nickname }}</div>
            <div class="date">{{ comment.timeStr }}</div>
          </div>
        </div>
        <!-- 评论内容 -->
        <div class="content">{{ comment.content }}</div>
      </div>
    </div>
    <!-- 最新评论 -->
    <div class="latest">
      <div class="title" v-if="newComments.length">最新评论</div>
      <div class="title" v-else>暂无评论</div>
      <div class="item" v-for="comment in newComments" :key="comment.commentId">
        <!-- 评论人 -->
        <div class="commenter" @click="toUserDetails(comment.user.userId)">
          <div class="avatar">
            <img :src="optimizeImageUrl(comment.user.avatarUrl, 50, 50)" alt="loading..." />
          </div>
          <div class="userInfo">
            <div class="nickname">{{ comment.user.nickname }}</div>
            <div class="date">{{ comment.timeStr }}</div>
          </div>
        </div>
        <!-- 评论内容 -->
        <div class="content">{{ comment.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { songCommentApi, playlistCommentApi, albumCommentApi, mvCommentApi } from '@/api/comment'
import { optimizeImageUrl } from '@/utils/format'
import type { CommentType } from '@/api/types'

const router = useRouter()

const props = defineProps<{ type: string; id: string | string[] | number }>()

/** 热门评论 */
const hotComments = ref<CommentType[]>([])
/** 最新评论 */
const newComments = ref<CommentType[]>([])

/** 根据类型获取评论 */
async function getComments() {
  let res: { hotComments: CommentType[]; comments: CommentType[] }
  if (props.type === 'song') {
    res = await songCommentApi(props.id)
  } else if (props.type === 'playlist') {
    res = await playlistCommentApi(props.id)
  } else if (props.type === 'album') {
    res = await albumCommentApi(props.id)
  } else {
    res = await mvCommentApi(props.id)
  }
  hotComments.value = res.hotComments
  newComments.value = res.comments
}

function toUserDetails(id: number) {
  router.push({
    name: 'userDetails',
    params: { id }
  })
}

getComments()
</script>

<style lang="less" scoped>
.Comments {
  width: 100%;
  height: auto;
  margin-top: 1rem;

  .releaseComment {
    width: 100%;
    height: 5rem;

    .el-button {
      float: right;
      margin-top: 0.5rem;
    }

    .total {
      color: #666;
      font-size: 14px;
      margin-top: 0.5rem;
    }
  }

  .hot,
  .latest {
    width: 100%;

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-top: 1rem;
    }

    .item {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      width: 100%;
      height: 4rem;
      border-bottom: 1px solid #ccc;
      position: relative;

      .commenter {
        display: flex;
        align-items: center;
        width: 10rem;
        cursor: pointer;
        z-index: 1;
        margin-right: 2rem;

        .avatar {
          height: 3rem;
          width: 3rem;
          margin: 0.5rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .nickname {
          width: 5rem;
          font-size: 14px;
        }

        .date {
          font-size: 13px;
          color: #666;
        }
      }

      .content {
        font-size: 12px;
        width: calc(100%-12rem);
      }

      .deletable {
        position: absolute;
        right: 0;
        font-size: 13px;
        cursor: pointer;
        padding: 0.5rem;

        &:hover {
          color: #e64545;
        }
      }
    }
  }
}
</style>
