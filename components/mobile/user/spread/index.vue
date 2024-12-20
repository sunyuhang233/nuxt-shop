<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;

const { info } = storeToRefs(useMemberStore());
const requestURL = useRequestURL();
const active = ref(0);

const onCopySidUrl = (value: string) => {
  navigator.clipboard.writeText(value.toLocaleString())
      .then(() => {
        console.log('复制成功', value);
        showNotify({ type: 'success', message: '复制成功' });
      })
      .catch(err => {
        console.error('复制失败', err);
        showNotify({ type: 'warning', message: '复制失败' });
      });
}

/* 划转佣金到余额 */
const showTransfer = ref<boolean>(false);
const submitTransfer = () => {
  showTransfer.value = true;
}

/* 佣金提现 */
const showWithdrawal = ref(false);
const submitWithdrawal = ()  => {
  showWithdrawal.value = true;
}

useHead({
  title: '邀请返利 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div class="wrapper">
    <van-cell-group :border="false">
      <van-cell center>
        <template #title>
          <div class="left">
            每单 {{ info?.rebatePercentage }}% 返现随时提现
            <div class="desc">有渠道可联系站长提升佣金比例哦</div>
            <div class="url-wrapper" @click="onCopySidUrl(requestURL.origin + '?sid=' + info?.sid)">{{requestURL.origin + '?sid=' + info?.sid}}</div>
          </div>
        </template>
        <template #right-icon>
          <div style="border: 1px solid rgb(0 0 0 / 9%); border-radius: 8px; background-color: white;">
            <n-qr-code :value="requestURL.origin + '?sid=' + info?.sid" :size="75" :padding="10"/>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="detail">
      <van-grid
          :column-num="2"
          :gutter="15"
          :center="false"
      >
        <van-grid-item>
          <template #default>
            <div class="text-content statistics">
              <div class="number">{{ info?.totalRebateOrdersCount }}</div>
              <div class="label">订单总数</div>
            </div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #default>
            <div class="text-content statistics">
              <div class="number">¥ {{ info?.rebateAmount?.toFixed(2) }}</div>
              <div class="label">我的佣金</div>
            </div>
          </template>
        </van-grid-item>
      </van-grid>
      <div style="padding: 15px 15px 0">
        <div class="bomaos-row">
          <n-button
              type="primary"
              size="large"
              block
              strong
              secondary
              style="flex-shrink: inherit"
              @click="submitTransfer"
          >
            佣金转余额
          </n-button>
          <n-button
              type="success"
              size="large"
              strong
              secondary
              block
              style="flex-shrink: inherit"
              @click="submitWithdrawal"
          >
            提现佣金
          </n-button>
        </div>
      </div>
    </div>
    <van-tabs
        v-model:active="active"
        shrink
        swipeable
        sticky
        :offset-top="65"
        line-width="20px"
        animated
        title-active-color="var(--bomaos-color-primary)"
    >
      <van-tab title="推广统计">
        <mobile-user-spread-record-orders />
      </van-tab>
      <van-tab title="提现记录">
        <mobile-user-spread-record-withdraw />
      </van-tab>
    </van-tabs>
    <mobile-user-spread-transfer v-model:visible="showTransfer" />
    <mobile-user-spread-withdraw v-model:visible="showWithdrawal" />
  </div>
</template>

<style scoped lang="less">
.wrapper :deep(.van-cell-group .van-cell .van-cell__title) .left {
  font-weight: 600;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.wrapper :deep(.van-cell-group .van-cell) {
  padding: 15px;
}

.wrapper :deep(.van-cell-group .van-cell .van-cell__title) {
  margin-right: 10px;
}

.wrapper :deep(.van-cell-group .van-cell .van-cell__title) .left .desc {
  font-weight: 400;
  font-size: 12px;
  opacity: .6;
  padding: 0 0 8px
}

.wrapper :deep(.van-cell-group .van-cell .van-cell__title) .left .url-wrapper {
  font-weight: 400;
  padding: 5px 5px;
  line-height: 1.2;
  background-color: #edf1f4;
  font-size: 12px;
  border-radius: 4px;
}

.wrapper :deep(.van-cell-group .van-cell) .icon-wrapper {
  cursor: pointer;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgb(26 137 251 / 12%);
  color: #1a89fa;
  font-size: 30px;
}

:deep(.van-tabs__nav) {
  justify-content: center;
}

:deep(.van-tabs__wrap) {
  border-bottom: 1px solid #f4f6f7;
}

:deep(.van-grid-item__content) {
  padding: 10px;
}

.text-content {
  border-radius: 0.26667rem;
  text-align: center;
  font-size: 14px;
  color: #ed6a0c;
  position: relative;
}

.wrapper .text-content {
  color: #101010;
}

.wrapper .statistics .number {
  font-size: 20px;
  font-weight: 500;
}

.wrapper .statistics .label {
  font-size: 13px;
  margin-top: 0.26667rem;
  color: #666;
}

.wrapper .statistics .withdraw {
  background: rgb(26 137 250 / 10%);
  color: #1a89fa;
  position: absolute;
  right: -15px;
  top: -15px;
  width: 80px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 0 7px;
}

.wrapper .detail {
  background-color: white;
  padding: 15px 0;
  font-size: 18px;
  border-bottom: 1px solid #f4f6f7;
  border-top: 1px solid #f4f6f7;
}
.bomaos-row {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  width: 100%;

  .bomaos-col {
    display: block;
  }
}
</style>