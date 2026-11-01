<template>
  <!-- MV主页 -->
  <div class="mv">
    <!-- MV分类 -->
    <div class="category">
      <!-- 地区分类 -->
      <div class="area">
        <div class="opts">
          <div
            :class="{ opt: true, selected: area.key === condition.area }"
            v-for="area in category.area"
            :key="area.key"
            @click="switchOpt(area.key, 'area')"
          >
            <span>{{ area.name }}</span>
          </div>
        </div>
      </div>
      <!-- 版本分类 -->
      <div class="type">
        <div class="opts">
          <div
            :class="{ opt: true, selected: type.key === condition.type }"
            v-for="type in category.type"
            :key="type.key"
            @click="switchOpt(type.key, 'type')"
          >
            <span>{{ type.name }}</span>
          </div>
        </div>
      </div>
      <!-- 热门最新分类 -->
      <div class="order">
        <div class="opts">
          <div
            :class="{ opt: true, selected: order.key === condition.order }"
            v-for="(order, i) in category.order"
            :key="i"
            @click="switchOpt(order.key, 'order')"
          >
            <span>{{ order.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- MV列表 -->
    <CVideoList :video-data="mvData" v-loading="isLoading" />
    <!-- 是否继续加载 -->
    <div class="continueLoading">
      <el-button color="#ed5736" plain @click="continueLoading">more...</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { staticMVCategory } from './static/useStaticData'
import { reactive, ref } from 'vue'
import { mvApi } from '@/api/mv'
import { ElMessage } from 'element-plus'
import CVideoList from '../../components/common/CMVList.vue'
import type { MVType } from '@/api/types'

const category = staticMVCategory

const isLoading = ref(true)

/** 查询条件 */
const condition = reactive({
  area: '全部',
  type: '全部',
  order: '全部',
  count: 1,
  limit: 24,
  isMore: false
})

/** MV 数据 */
const mvData = ref<MVType[]>([])

/** 获取分类 MV 数据 */
async function getMV() {
  isLoading.value = true
  const res = await mvApi(
    condition.area,
    condition.type,
    condition.order,
    (condition.count - 1) * condition.limit,
    condition.limit
  )
  mvData.value.push(...res.data)
  condition.isMore = res.hasMore
  isLoading.value = false
}

/** 切换分类条件 */
function switchOpt(key: string, opt: string) {
  if (opt == 'area') {
    condition.area = key
  } else if (opt == 'type') {
    condition.type = key
  } else {
    condition.order = key
  }
  // 清空
  mvData.value = []
  condition.count = 1
  getMV()
}

// 继续加载
function continueLoading() {
  if (condition.isMore) {
    condition.count++
    getMV()
  } else {
    ElMessage.warning('暂无更多数据!')
  }
}

getMV()
</script>

<style lang="less">
.mv {
  .category {
    margin: 1rem 0;

    .area,
    .type,
    .order {
      display: flex;
      align-items: flex-start;
      margin: 1rem 0;

      .opts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-left: 12px;
        font-size: 14px;

        .opt {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
          border: 1px solid #eee;

          &:hover {
            background: rgba(236, 65, 65, 0.08);
            border-color: rgba(236, 65, 65, 0.2);
            transform: translateY(-2px);
          }

          &.selected {
            color: #ec4141;
            background: rgba(236, 65, 65, 0.08);
            border-color: rgba(236, 65, 65, 0.2);
          }
        }
      }
    }
  }

  .continueLoading {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
  }
}
</style>
