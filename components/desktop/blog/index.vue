<script setup lang="ts">
import type {CategoryArticleDto} from "~/api/content/article-category/model";
import {listArticles} from "~/api/content/article";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;

// 加载状态
const isLoading = ref(true);

const CategoryArticleList = ref<CategoryArticleDto[]>([]);
// 激活项
const currentItem = ref<number>();

listArticles().then((d) => {
  CategoryArticleList.value = d;
  if (CategoryArticleList.value.length > 0) {
    // 设置初始的激活项
    currentItem.value = CategoryArticleList.value[0].id;
  }
  isLoading.value = false;
})

const checkCurrentItem = () => {
  let found = false;
  for (let item of CategoryArticleList.value) {
    const element = document.getElementById(item.id as unknown as string);
    if (element && element.getBoundingClientRect().top <= window.innerHeight / 2) {
      currentItem.value = item.id;
      found = true;
    } else if (found) {
      break;
    }
  }
};

/**
 * 执行平滑跳转到指定位置
 *
 * @param id
 */
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
    window.scrollTo({
      top: middle,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', checkCurrentItem);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkCurrentItem);
});

useHead({
  title: '我的帮助 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div class="container">
    <desktop-common-loading v-if="isLoading"/>
    <div v-else style="margin: 15px 0; min-height: calc(100vh - 432px)">
      <n-row gutter="15" style="display: block;">
        <n-col :span="7" class="sticky">
          <n-card
              title="分类导航"
              :bordered="false"
              :segmented="{
                  content: true,
                  footer: 'soft'
                }"
              :header-style="{padding: '13px 20px'}"
              :content-style="{padding: 0}"
          >
            <template #header-extra>
              <span style="color: #666">跳转指定位置</span>
            </template>
            <div
                v-for="item in CategoryArticleList"
                :key="item.id"
                class="nav-item"
                :class="{ active: currentItem === item.id, disabled: currentItem === item.id }"
                @click.prevent="currentItem !== item.id && scrollToElement(item.id as string)"
            >
              <div class="cover">
                <van-image
                    :width="25"
                    :height="25"
                    round
                    fit="cover"
                    style="border-radius: 5px"
                    :src="item.cover as string"
                    :lazy-load="true"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="12" />
                  </template>
                </van-image>
              </div>
              <div class="nav-cell__title">
                <div :style="{ fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center'}">
                  <n-ellipsis :line-clamp="1" :tooltip="false">
                    {{ item.name }}
                  </n-ellipsis>
                </div>
                <div>
                  <n-tag :bordered="true" size="small" type="success">
                    {{ item.articleCount }} 个文章
                  </n-tag>
                </div>
              </div>
            </div>
          </n-card>
          <desktop-common-hot-post/>
        </n-col>
        <n-col :span="17">
          <n-card
              v-for="categoryArticleDto in CategoryArticleList"
              :key="categoryArticleDto.id"
              :title="categoryArticleDto.name"
              :id="categoryArticleDto.id"
              :bordered="false"
              :segmented="{
                  content: true,
                  footer: 'soft'
                }"
              :header-style="{padding: '13px 20px'}"
              :content-style="{padding: 0}"
          >
            <template #header-extra>
              <n-tag :bordered="true" size="small" type="success">
                文章数量: {{ categoryArticleDto.articleCount }}
              </n-tag>
            </template>
            <!-- 套图详情 -->
            <div class="van-wrapper" :style="{ padding: '0' }">
              <desktop-blog-article-item v-for="item in categoryArticleDto.articleDtoList" :key="item.id" :article="item"/>
            </div>
          </n-card>
        </n-col>
      </n-row>
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.n-card) {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0px;
  }
}

/* 快捷导航 */
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px 20px;
  color: var(--bomaos-color-dark);
  border-bottom: var(--bomaos-border-color);

  &:nth-last-child(1) {
    border-bottom: 0px solid transparent;
  }

  &:hover {
    background-color: #f5f5f561;
  }

  &.active {
    background-color: #f5f5f561;
    color: var(--bomaos-color-primary); /* 激活项的样式 */

    &:before {
      transition: top 0.3s ease-in-out;
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 30%;
      border-inline-start: 3px solid var(--bomaos-color-primary);
      border-radius: 999px;
      content: " ";
    }
  }

  &.disabled {
    pointer-events: none; /* 禁止点击 */
  }

  .cover {
    width: 25px;
    display: flex;
    align-items: center;
  }

  .nav-cell__title {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
</style>