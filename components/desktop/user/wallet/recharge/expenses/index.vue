<template>
  <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
      row-key="id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a-tooltip>
          <template #title>{{ record.name }}</template>
          {{ record.name }}
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import type {MoneyRecord, MoneyRecordParam} from "@/api/income/money-record/model";
import {pageMoneyRecords} from "~/api/income/money-record";

/**
 * 表格列配置
 */
const columns = [
  {
    title: "记录名称",
    dataIndex: "name",
    key: "name",
    width: 180,
    ellipsis: true,
  },
  {
    title: "消费金额",
    dataIndex: "money",
    key: "money",
    align: "center",
    width: 100,
  },
  {
    title: "余额",
    dataIndex: "balance",
    key: "balance",
    align: "center",
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 170,
    align: "center",
  }
];

/**
 * 数据源和状态
 */
const dataSource = ref<MoneyRecord[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
});

/**
 * 查询参数
 */
const params = reactive<MoneyRecordParam>({
  page: 1,
  limit: 5,
});

/**
 * 查询数据
 */
const query = () => {
  loading.value = true;
  pageMoneyRecords(params)
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