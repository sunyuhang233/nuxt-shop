<script setup lang="ts">
import type {OrderParam, OrdersDto} from "~/api/income/orders/model";
import {pageOrders} from "~/api/income/orders";
import {onMounted, reactive, ref} from "vue";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;

const showCheck = ref<boolean>(false);
// 当前编辑数据
const current = ref<OrdersDto | null>(null);

/**
 * 打开查看卡密
 * @param value
 */
const openCheck = (value: OrdersDto) => {
  showCheck.value = true;
  current.value = value;
}

const ordersList = ref<OrdersDto[]>([]);

/**
 * 提交的附加内容
 */
const orderParams = reactive<OrderParam>({
  page: 1,
  limit: 6
})

const state = ref(true);
const loading = ref(false);
const disabled = ref(false);
const page = ref<number>(0);
const initialLoading = ref(true);

const handleInfiniteOnLoad = () => {
  if (ordersList.value.length == 0) {
    page.value = 1;
  } else {
    page.value++;
  }
  query(orderParams.limit, page.value);
};

/**
 * 查询订单数据
 * @param limit
 * @param page
 */
const query = (limit?: number, page?: number) => {
  if (loading.value) return; // Prevent calls if already loading
  loading.value = true;
  pageOrders({limit, page}).then((res) => {
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false; // Reset initial loading state only once

    if (res?.count === 0) {
      state.value = true;
      return;
    }
    state.value = false;
    ordersList.value.push(...(res?.list as OrdersDto[]));
    if (ordersList.value.length >= (res?.count as number)) {
      disabled.value = true;
    }
  })
}

/* 初始化数据 */
onMounted(() => {
  page.value = 1;
  nextTick(() => {
    query(orderParams.limit, page.value); // Call query directly to initiate data fetch
  });
})

useHead({
  title: '我的订单 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div style="margin: 15px">
    <n-spin :show="initialLoading">
      <mobile-common-empty v-if="state" description="您还未购买任何商品" height="calc(100vh - 415px)">
        <template #icon>
          <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
              <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
              <g fill-rule="nonzero" stroke="#d9d9d9">
                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path>
              </g>
            </g>
          </svg>
        </template>
        <template #button>
          <n-button strong secondary round type="primary" icon-placement="right" @click="navigateTo('/')">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"/></svg>
            </template>
            前往购买
          </n-button>
        </template>
      </mobile-common-empty>
      <div v-else>
        <n-row :gutter="[15, 15]">
          <n-col
              v-for="item in ordersList"
              :key="item.orderId"
              :span="24"
          >
            <mobile-user-orders-order-item
                :data="item"
                @done="openCheck"
            />
          </n-col>
        </n-row>
        <div style="margin-top: 20px; margin-bottom: 20px; display: flex; justify-content: center;">
          <n-button strong secondary round type="primary" :loading="loading" :disabled="disabled" @click="handleInfiniteOnLoad">
            {{ disabled ? '加载完成' : '加载更多' }}
          </n-button>
        </div>
      </div>
    </n-spin>
    <!-- 查看卡密 -->
    <mobile-user-orders-check v-model:visible="showCheck" :data="current"/>
  </div>
</template>

<style scoped lang="less">

</style>