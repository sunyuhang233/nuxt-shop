<script setup lang="ts">
import type {ClassifyDto} from "~/api/product/classify/model";
import {listClassifyDtos} from "~/api/product/classify";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;

// 分类与商品数据
const classifyList = ref<ClassifyDto[]>([]);
// 激活项
const currentItem = ref<number>();
// 加载状态
const isLoading = ref<boolean>(true);

/**
 * 查询商品
 */
await useAsyncData("read_products", async () => listClassifyDtos()).then((d) => {
  classifyList.value = d.data.value as ClassifyDto[];
  if (classifyList.value.length > 0) {
    // 设置初始的激活项
    currentItem.value = classifyList.value[0].classifyId;
  }
  isLoading.value = false;
})

const visible = ref<boolean>(false);

onMounted(() => {
  const isDialogMessage = useCookie("isDialogMessage");
  if (setting.isDialogMessage == 1 && !isDialogMessage.value) {
    setTimeout(() => {
      visible.value = true;
    }, 500)
  }
})

useHead({
  title: setting.websiteName + ' - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div style="margin: 15px">
    <div class="boniu-card" style="margin-bottom: 15px">
      <common-view-md :content="setting.placard as string" />
    </div>
    <n-spin :show="isLoading">

      <div v-if="classifyList.length >= 1">
        <template v-for="item in classifyList" :key="item.classifyId">
          <n-card
              :id="item.classifyId"
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
                class="van-cell clickable"
                :style="{padding: '15px'}"
                v-for="product in item.products"
                :key="product.productId"
                :to="'/product/' + product.uniqueLink"
            >
              <div style="margin-right: 15px; display: inherit;">
                <van-image
                    :width="50"
                    :height="50"
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
              <div class="van-cell__title">
                <div class="title">
                        <span :style="{ fontSize: '18px'}">
                          <n-ellipsis :line-clamp="2" :tooltip="false">
                            {{ product.name }}
                          </n-ellipsis>
                        </span>
                  <div style="margin-top: 2px; color: #999; line-height: 1.5;">
                    <n-ellipsis :line-clamp="2" :tooltip="false">
                      {{ product.description }}
                    </n-ellipsis>
                  </div>
                </div>
                <div class="van-cell__label" style="margin-top: 5px">
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
                      <span style="margin-left: 5px; color: var(--bomaos-color-danger); font-weight: bold">{{ product.price?.toFixed(2) }}</span>
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
        </template>
      </div>
      <desktop-common-empty v-else description="暂无商品" height="350px" :is-button="false">
        <template #icon>
          <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#d9d9d9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path></g></g></svg>
        </template>
      </desktop-common-empty>
    </n-spin>
    <mobile-common-placard-dialog v-if="setting.isDialogMessage == 1" v-model:visible="visible" :content="setting.dialogMessage"/>
  </div>
</template>

<style scoped lang="less">
:deep(.n-card) {
  margin-bottom: 15px;
}

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
  border-bottom: 1px solid #f0f0f0;

  &:nth-last-child(1) {
    border-bottom: 0px solid transparent;
  }

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
    span {
      span{
        font-weight: 600;
        font-size: 16px;
      }
    }
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

.n-spin-container {
  position: relative;
  min-height: 100px;
}
</style>