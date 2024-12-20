<template>
  <div v-if="state" style="margin: 15px">
    <mobile-common-empty description="暂无充值记录" height="calc(100vh - 415px)">
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
    </mobile-common-empty>
  </div>
  <div v-else>
    <div class="bomaos-wrapper">
      <n-row :gutter="[15, 0]">
        <n-col :span="24" class="van-clearfix" v-for="(item, index) in list" :key="item.rechargeId">
          <div class="bomaos-order-item" :style="{borderTop: index == 0 ? 'none' : '1px solid rgb(238 240 242)'}">
            <div class="bomaos-order-detail">
              <div class="bomaos-order-title">
                <h3>订单号: {{ item.rechargeId }}</h3>
                <van-tag plain :type="item.status == 1 ? 'success' : 'danger'">{{ item.status == 1 ? '已充值' : '未充值' }}</van-tag>
              </div>
              <div class="bomaos-order-bottom">
                <h4>充值名称: {{ item.name }}</h4>
                <span>充值金额: {{ item.totalAmount }}</span>
              </div>
              <div class="paytime">充值时间: {{ item.paymentTime }}</div>
            </div>
          </div>
        </n-col>
      </n-row>
    </div>
    <div style="margin-top: 20px; margin-bottom: 20px; display: flex; justify-content: center;">
      <n-button strong secondary round type="primary" :loading="loading" :disabled="disabled" @click="handleInfiniteOnLoad">
        {{ disabled ? '加载完成' : '加载更多' }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {pageRechargeRecords} from "@/api/income/recharge-record";
import type {RechargeRecord, RechargeRecordParam} from "@/api/income/recharge-record/model";

const list = ref<RechargeRecord[]>([]);

/**
 * 提交的附加内容
 */
const params = reactive<RechargeRecordParam>({
  page: 1,
  limit: 5
});

const state = ref(true);
const loading = ref(false);
const disabled = ref(false);
const page = ref<number>(0);

const handleInfiniteOnLoad = () => {
  if (list.value.length == 0) {
    page.value = 1;
  } else {
    page.value++;
  }
  query(params.limit, page.value);
};

/**
 * 查询订单数据
 * @param limit
 * @param page
 */
const query = (limit?: number, page?: number) => {
  loading.value = true;
  setTimeout(() => {
    pageRechargeRecords({limit, page}).then((res) => {
      if (res?.count === 0) {
        state.value = true;
        loading.value = false;
        return;
      }
      state.value = false;
      loading.value = false;
      list.value.push(...res?.list);
      if (list.value.length >= res?.count) {
        disabled.value = true;
      }
    })
  }, 100)
}

/* 初始化数据 */
onMounted(() => {
  page.value = 0;
  handleInfiniteOnLoad();
})
</script>

<style scoped>
.bomaos-wrapper {
  margin: 15px;
  background-color: white;
  border-radius: 8px
}

.van-theme-dark .bomaos-wrapper {
  background-color: #1c1c1e;
}

.bomaos-order-item {
  display: flex;
  flex-direction: row;
  padding: 15px;
  align-items: flex-start;
}

.bomaos-order-item .bomaos-order-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.bomaos-order-item .bomaos-order-detail .paytime{
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.van-theme-dark .bomaos-order-item .bomaos-order-detail .paytime {
  color: #999;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-title h3 {
  font-size: 16px;
  font-weight: 400;
}

.van-theme-dark .bomaos-order-item .bomaos-order-detail .bomaos-order-title h3 {
  color: white;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-bottom h4 {
  color: #666;
  font-size: 12px;
  font-weight: normal;
}

.van-theme-dark .bomaos-order-item .bomaos-order-detail .bomaos-order-bottom h4 {
  color: #999;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-bottom span {
  font-size: 12px;
  color: #666;
}

.van-theme-dark .bomaos-order-item .bomaos-order-detail .bomaos-order-bottom span {
  color: #999;
}
</style>