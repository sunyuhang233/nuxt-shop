<script setup lang="ts">
import {listClassifyDtos} from "~/api/product/classify";
import type {ClassifyDto} from "~/api/product/classify/model";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;

// 分类与商品数据
const classifyList = ref<ClassifyDto[]>([]);
// 激活项
const currentItem = ref<number>();

/**
 * 查询商品
 */
await useAsyncData("read_classify_list", async () => listClassifyDtos()).then((d) => {
  classifyList.value = d.data.value as ClassifyDto[];
  if (classifyList.value.length > 0) {
    // 设置初始的激活项
    currentItem.value = classifyList.value[0].classifyId;
  }
});

const checkCurrentItem = () => {
  let found = false;
  for (let item of classifyList.value) {
    const element = document.getElementById(item.classifyId as unknown as string);
    if (element && element.getBoundingClientRect().top <= window.innerHeight / 2) {
      currentItem.value = item.classifyId;
      found = true;
    } else if (found) {
      break;
    }
  }
};

/**
 * 执行平滑跳转到指定位置
 *
 * @param classifyId
 */
const scrollToElement = (classifyId: string) => {
  const element = document.getElementById(classifyId);
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
  title: setting.websiteName + ' - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div class="container">
    <div style="margin: 15px 0; min-height: calc(100vh - 432px)">
      <div style="margin-bottom: 15px">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <common-view-md :content="setting.placard as string" />
        </n-card>
      </div>
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
            <div v-if="classifyList.length >= 1">
              <div
                  v-for="item in classifyList"
                  :key="item.classifyId"
                  class="nav-item"
                  :class="{ active: currentItem === item.classifyId, disabled: currentItem === item.classifyId }"
                  @click.prevent="currentItem !== item.classifyId && scrollToElement(item.classifyId as string)"
              >
                <div class="cover">
                  <van-image
                      :width="25"
                      :height="25"
                      round
                      fit="cover"
                      style="border-radius: 5px"
                      :src="item.icon as string"
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
                      {{ item.productCount }} 个商品
                    </n-tag>
                  </div>
                </div>
              </div>
            </div>
            <desktop-common-empty v-else description="暂无分类" height="150px" :is-button="false">
              <template #icon>
                <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#d9d9d9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path></g></g></svg>
              </template>
            </desktop-common-empty>
          </n-card>
          <!-- 热门推荐 -->
          <desktop-common-hot-post />
        </n-col>
        <n-col :span="17">
          <div v-if="classifyList.length >= 1">
            <n-card
                v-for="item in classifyList"
                :id="item.classifyId"
                :key="item.classifyId"
                :title="item.name"
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
                  {{ item.productCount }} 个商品
                </n-tag>
              </template>
              <nuxt-link
                  class="bomaos-cell clickable"
                  :style="{padding: '20px'}"
                  v-for="product in item.products"
                  :key="product.productId"
                  :to="'/product/' + product.uniqueLink"
              >
                <div style="margin-right: 15px; display: inherit;">
                  <van-image
                      :width="85"
                      :height="85"
                      round
                      fit="cover"
                      style="border-radius: 5px; background-color: rgba(0, 0, 0, 0.05); display: block;"
                      :src="product.coverImage as string"
                      :lazy-load="true"
                  >
                    <template v-slot:loading>
                      <van-loading type="spinner" size="40" />
                    </template>
                  </van-image>
                </div>
                <div class="bomaos-cell__title">
                  <div class="title">
                  <span :style="{ fontSize: '18px'}">
                    <n-ellipsis :line-clamp="2" :tooltip="false">
                      {{ product.name }}
                    </n-ellipsis>
                  </span>
                    <div style="margin-top: 2px; color: #999; line-height: 1.5;">
                      <n-ellipsis :line-clamp="1" :tooltip="false">
                        {{ product.description }}
                      </n-ellipsis>
                    </div>
                  </div>
                  <div class="bomaos-cell__label" style="margin-top: 5px">
                    <n-space :size="0" style="align-items: center;">
                      <div class="action">
                        <n-tag
                            size="small"
                            :bordered="false"
                            :type="product.shippingType === 0 ? 'info' : 'error'"
                        >
                          {{ product.shippingType === 0 ? '自动发货' : '人工发货' }}
                        </n-tag>
                      </div>
                      <n-divider vertical />
                      <div class="action">
                        <span>价格: </span>
                        <span style="margin-left: 5px; color: var(--bomaos-color-danger); font-weight: bold">{{ product.price }}</span>
                      </div>
                      <n-divider vertical />
                      <div class="action">
                        <span>销量: </span>
                        <span style="margin-left: 5px; color: var(--bomaos-color-primary)">{{ product.usedCount }}</span>
                      </div>
                      <n-divider vertical />
                      <div class="action">
                        <span>库存: </span>
                        <span style="margin-left: 5px; color: var(--bomaos-color-primary)">{{ product.unusedCount }}</span>
                      </div>
                    </n-space>
                  </div>
                </div>
              </nuxt-link>
            </n-card>
          </div>
          <desktop-common-empty v-else description="暂无商品" height="350px" :is-button="false">
            <template #icon>
              <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#d9d9d9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path></g></g></svg>
            </template>
          </desktop-common-empty>
        </n-col>
      </n-row>
    </div>
  </div>
</template>

<style scoped lang="less">
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

:deep(.n-card) {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0px;
  }
}

.bomaos-cell {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  overflow: hidden;
  color: #000000;
  font-size: 14px;
  line-height: 24px;
  border-bottom: 1px solid #f0f0f0;

  &:nth-last-child(1) {
    border-bottom: 0px solid transparent;
  }

  &:hover {
    background-color: #f5f5f561;
  }
}

.bomaos-cell--clickable {
  cursor: pointer;
}

.bomaos-cell__title, .bomaos-cell__value {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    display: flex;
    flex-direction: column;
    span {
      span{
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
}

.bomaos-cell__label {
  margin-top: 0;
  color: #707070;
  font-size: 12px;
  line-height: 18px;

  .action {
    font-size: 15px;
    display: flex;
    align-items: center;
  }
}

.bomaos-cell__value {
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

.bomaos-cell__left-icon, .bomaos-cell__right-icon {
  height: 24px;
  font-size: 16px;
  line-height: 24px;
}

.bomaos-cell__right-icon {
  margin-left: 4px;
  color: #969799;
}
</style>