<script setup lang="ts">
import {reactive, ref} from "vue";
import {pageRebateRecords} from "@/api/member/rebate-record";
import type {RebateRecord, RebateRecordParam} from "@/api/member/rebate-record/model";

const list = ref<RebateRecord[]>([]);
const count = ref(0);
const finished = ref(false);
const loading = ref(false);
const refreshing = ref(false);

/**
 * 提交的附加内容
 */
const params = reactive<RebateRecordParam>({
  page: 1,
  limit: 5
});

const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
    }
    pageRebateRecords(params).then((res) => {
      list.value.push(...res.list);
      loading.value = false;
      if (list.value.length >= res.count) {
        finished.value = true;
      }
    })
  }, 400);
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};
/* 数据列表 end */
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        style="margin-top: 15px"
    >
      <van-cell-group inset>
        <div v-for="(item, index) in list" :key="item" class="bomaos-order-item" :style="{borderTop: index == 0 ? 'none' : '1px solid rgb(238 240 242)'}">
          <div class="bomaos-order-detail">
            <div class="bomaos-order-title">
              <h3>{{ item.productName }}</h3>
              <span>佣金: {{ item.brokerage }}</span> <!-- 佣金 -->
            </div>
            <div class="bomaos-order-bottom">
              <h4>下单用户: {{ item.superiorNickName }}</h4>
              <span>订单金额: {{ item.brokerage }}</span>
            </div>
            <div class="paytime">支付时间: {{ item.paymentTime }}</div>
          </div>
        </div>
      </van-cell-group>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped lang="less">
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

.bomaos-order-item .bomaos-order-detail .bomaos-order-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-title h3 {
  font-size: 16px;
}

.bomaos-order-item .bomaos-order-detail .bomaos-order-title span {
  font-weight: bold;
  font-size: 15px;
  color: #F56C6C;
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

.bomaos-order-item .bomaos-order-detail .bomaos-order-bottom span {
  font-size: 12px;
  color: #666;
}
</style>