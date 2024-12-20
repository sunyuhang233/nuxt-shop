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
import type { WithdrawRecord, WithdrawRecordParam } from "@/api/member/withdraw-record/model";
import { pageWithdrawRecords } from "@/api/member/withdraw-record";

/**
 * 表格列配置
 */
const columns = [
  {
    title: "提现类型",
    dataIndex: "withdrawType",
    key: "withdrawType",
    width: 100,
  },
  {
    title: "账户",
    dataIndex: "account",
    key: "account",
    width: 120,
    ellipsis: true,
    scopedSlots: { customRender: "account" },
  },
  {
    title: "金额",
    dataIndex: "money",
    key: "money",
    width: 80,
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 70,
    align: "center",
    customRender: ({ text }) => {
      return text === 1
          ? "提现成功"
          : text === 2
              ? "提现错误"
              : "等待到账";
    },
  },
  {
    title: "提现说明",
    dataIndex: "summary",
    key: "summary",
    width: 100,
  },
  {
    title: "提现时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 140,
    align: "center",
  },
];

/**
 * 数据源和状态
 */
const dataSource = ref<WithdrawRecord[]>([]);
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
});

/**
 * 查询参数
 */
const params = reactive<WithdrawRecordParam>({
  page: 1,
  limit: 5,
});

/**
 * 查询数据
 */
const query = () => {
  loading.value = true;
  pageWithdrawRecords(params)
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