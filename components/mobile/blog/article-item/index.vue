<script setup lang="ts">
import type {ArticleDto} from "~/api/content/article/model";

const dayjs = useDayjs();

const props = defineProps<{
  // 弹窗是否打开
  article?: ArticleDto;
}>();
</script>

<template>
  <nuxt-link
      class="van-cell clickable"
      :style="{padding: '15px'}"
      :to="'/post/' + article?.id"
  >
    <div class="van-cell__title">
      <div class="title">
        <div class="title" :style="{ fontSize: '15px'}">
          <n-ellipsis :line-clamp="2" :tooltip="false">
            {{ article.title }}
          </n-ellipsis>
        </div>
        <div style="margin-top: 2px; color: #555; line-height: 1.5;">
          <n-ellipsis :line-clamp="1" :tooltip="false">
            {{ article.summary }}
          </n-ellipsis>
        </div>
      </div>
      <div class="van-cell__label" style="margin-top: 5px">
        <n-space :size="0">
          <div style="font-size: 12px">{{ dayjs(article.createTime).fromNow() }}</div>
          <n-divider vertical />
          <div style="font-size: 12px; display: flex; align-items: center;">
            <eye-outlined />
            <span style="margin-left: 5px">{{ article.likes }}</span>
          </div>
        </n-space>
      </div>
    </div>
    <div style="margin-left: 15px; display: inherit;">
      <van-image
          :width="60"
          :height="60"
          round
          fit="cover"
          style="border-radius: 5px"
          :src="article?.cover as string"
          :lazy-load="true"
      >
        <template v-slot:loading>
          <van-loading type="spinner" size="40" />
        </template>
      </van-image>
    </div>
  </nuxt-link>
</template>

<style scoped lang="less">
.van-cell {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  overflow: hidden;
  color: #000000;
  font-size: 14px;
  line-height: 24px;

  &:hover {
    background-color: #f5f5f561;
  }
}

.van-cell--clickable {
  cursor: pointer;
}

.van-cell__title, .van-cell__value {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    display: flex;
    flex-direction: column;
    .title {
      span{
        font-weight: 600;
        font-size: 15px;
      }
    }
  }
}

.van-cell__label {
  margin-top: 0px;
  color: #707070;
  font-size: 12px;
  line-height: 18px;
}

.van-cell__value {
  position: relative;
  overflow: hidden;
  color: #707070;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
}

.van-icon {
  position: relative;
  display: inline-block;
  font: 14px/1 vant-icon;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}

.van-cell__left-icon, .van-cell__right-icon {
  height: 24px;
  font-size: 16px;
  line-height: 24px;
}

.van-cell__right-icon {
  margin-left: 4px;
  color: #969799;
}
</style>