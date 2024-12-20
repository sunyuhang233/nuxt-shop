<template>
  <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
      row-key="rechargeId"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a-tooltip>
          <template #title>{{ record.name }}</template>
          {{ record.name }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status == 0 ? 'orange' : 'blue'" style="margin-right: 0;">{{ record.status == 0 ? '未支付' : '已支付' }}</a-tag>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import {reactive, ref, onMounted, h} from "vue";
import { message } from "ant-design-vue";
import type {RechargeRecord, RechargeRecordParam} from "@/api/income/recharge-record/model";
import {pageRechargeRecords} from "@/api/income/recharge-record";

/**
 * 表格列配置
 */
const columns = [
  {
    title: "订单号",
    dataIndex: "rechargeId",
    key: "rechargeId",
    width: 180,
    ellipsis: true,
  },
  {
    title: "充值名称",
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 100,
    ellipsis: true,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 80,
  },
  {
    title: "充值金额",
    dataIndex: "totalAmount",
    key: "totalAmount",
    align: "center",
    width: 90,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180,
    align: "center",
  }
];

/**
 * 数据源和状态
 */
const dataSource = ref<RechargeRecord[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
});

/**
 * 查询参数
 */
const params = reactive<RechargeRecordParam>({
  page: 1,
  limit: 5,
});

/**
 * 查询数据
 */
const query = () => {
  loading.value = true;
  pageRechargeRecords(params)
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
/* 相关样式 */
</style>