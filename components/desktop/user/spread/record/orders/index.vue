<template>
  <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
      row-key="id"
  />
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import type { RebateRecord, RebateRecordParam } from "@/api/member/rebate-record/model";
import { pageRebateRecords } from "@/api/member/rebate-record";

/**
 * 表格列配置
 */
const columns = [
  {
    title: "商品名称",
    dataIndex: "productName",
    key: "productName",
    width: 150,
    ellipsis: true,
  },
  {
    title: "用户昵称",
    dataIndex: "superiorNickName",
    key: "superiorNickName",
    width: 100,
    ellipsis: true,
  },
  {
    title: "付款金额",
    dataIndex: "money",
    key: "money",
    width: 80,
    align: "center",
  },
  {
    title: "佣金",
    dataIndex: "brokerage",
    key: "brokerage",
    width: 70,
    align: "center",
  },
  {
    title: "付款时间",
    dataIndex: "paymentTime",
    key: "paymentTime",
    width: 150,
    align: "center",
  },
];

/**
 * 数据源和状态
 */
const dataSource = ref<RebateRecord[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
});

/**
 * 查询参数
 */
const params = reactive<RebateRecordParam>({
  page: 1,
  limit: 5,
});

/**
 * 查询数据
 */
const query = () => {
  loading.value = true;
  pageRebateRecords(params)
      .then((res) => {
        loading.value = false;
        dataSource.value = res.list;
        pagination.total = res.count;
      })
      .catch((err) => {
        loading.value = false;
        message.error("数据加载失败");
      });
};

/**
 * 表格分页、排序、筛选变化事件
 */
const handleTableChange = (paginationInfo) => {
  params.page = paginationInfo.current;
  params.limit = paginationInfo.pageSize;
  pagination.current = paginationInfo.current;
  query();
};

/**
 * 初始化加载数据
 */
onMounted(() => {
  query();
});
</script>

<style scoped lang="less">
/* 样式部分可按需调整 */
</style>