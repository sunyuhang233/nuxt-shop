<script setup lang="ts">
import {getHotPosts} from "~/api/product/product";
import type {Product} from "~/api/product/product/model";

const hotProductList = ref<Product[]>([]);

await useAsyncData("read_hot_product", async () => getHotPosts()).then((d) => {
  hotProductList.value = d.data.value;
})
</script>

<template>
  <n-card
      title="热门商品"
      :bordered="false"
      :segmented="{
        content: true,
        footer: 'soft'
      }"
      :header-style="{padding: '13px 20px'}"
      :content-style="{padding: 0}"
  >
    <template #header-extra>
      <span style="color: #666">六小时刷新一次</span>
    </template>
    <div v-if="hotProductList.length >= 1">
      <template
          v-for="item in hotProductList"
          :key="item.productId"
      >
        <nuxt-link class="nav-item" :to="'/product/' + item.uniqueLink">
          <div class="cover">
            <van-image
                :width="50"
                :height="50"
                round
                fit="cover"
                style="border-radius: 5px"
                :src="item.coverImage as string"
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
            <div class="van-cell__label" style="margin-top: 5px">
              <n-space :size="0">
                <div class="action">
                  <span :style="{color: item.shippingType === 0 ? 'var(--bomaos-color-primary)' : 'red'}">{{ item.shippingType === 0 ? '自动发货' : '人工发货' }}</span>
                </div>
                <n-divider vertical />
                <div class="action">
                  <span>价格: </span>
                  <span style="margin-left: 5px; color: var(--bomaos-color-danger); font-weight: bold">{{ item.price }}</span>
                </div>
              </n-space>
            </div>
          </div>
        </nuxt-link>
      </template>
    </div>
    <desktop-common-empty v-else description="暂无商品" height="150px" :is-button="false">
      <template #icon>
        <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#d9d9d9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path></g></g></svg>
      </template>
    </desktop-common-empty>
  </n-card>
</template>

<style scoped lang="less">
/* 快捷导航 */
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
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
      left: 1px;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 50%;
      border-inline-start: 3px solid var(--bomaos-color-primary);
      border-radius: 999px;
      content: " ";
    }
  }

  &.disabled {
    pointer-events: none; /* 禁止点击 */
  }

  .cover {
    width: 50px;
    display: flex;
    align-items: center;
  }

  .nav-cell__title {
    margin-left: 10px;
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
  }
}

.van-cell__label {
  margin-top: 0px;
  color: #707070;
  font-size: 12px;
  line-height: 18px;

  .action {
    font-size: 13px;
    display: flex;
    align-items: center;
  }
}
</style>