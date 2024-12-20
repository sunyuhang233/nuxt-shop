<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import type {PaymentResult} from "~/api/income/orders/model";

const setting = useSettingStore().setting as StoreSetting;

const { info } = storeToRefs(useMemberStore());

const showRecharge = ref<boolean>(false);

const onRecharge = () => {
  showRecharge.value = true;
}

/**
 * 打开扫码支付
 */
const showQrcodePayment = ref<boolean>(false)
const paymentResult = ref<PaymentResult | null>(null)
const openQrcodePayment = (value: PaymentResult) => {
  showQrcodePayment.value = true
  paymentResult.value = value
}

useHead({
  title: '我的钱包 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div>
    <n-row gutter="15">
      <n-col :span="8">
        <n-card
            :bordered="false"
            :segmented="{
                  content: true,
                  footer: 'soft'
                }"
            :content-style="{padding: '15px'}"
        >
          <div class="wallet-wrapper">
            <div>
              <div class="user-item-name">当前余额</div>
              <p class="user-item-count">{{ info?.balance?.toFixed(2) }}</p>
              <div class="user-item-desc">RMB</div>
            </div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card
            :bordered="false"
            :segmented="{
                  content: true,
                  footer: 'soft'
                }"
            :content-style="{padding: '15px'}"
        >
          <div class="wallet-wrapper">
            <div>
              <div class="user-item-name">已消费</div>
              <p class="user-item-count">0.00</p>
              <div class="user-item-desc">RMB</div>
            </div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card
            :bordered="false"
            :segmented="{
                  content: true,
                  footer: 'soft'
                }"
            :content-style="{padding: '15px'}"
        >
          <div class="wallet-wrapper">
            <div>
              <div class="user-item-name">佣金</div>
              <p class="user-item-count">{{ info?.totalRebateOrdersCount?.toFixed(2) }}</p>
              <div class="user-item-desc">RMB</div>
            </div>
          </div>
        </n-card>
      </n-col>
    </n-row>
    <div style="margin-top: 15px">
      <n-card :bordered="false" content-style="padding: 0;">
        <n-tabs
            type="line"
            size="large"
            :bar-width="20"
            :tabs-padding="20"
            animated
            :pane-style="{ padding: '20px', width: 'auto' }"
        >
          <template #suffix>
            <a-button
                type="default"
                :style="{ marginRight: '20px', backgroundColor: '#e6f7ff', borderColor: '#91d5ff', color: '#1890ff' }"
                @click="onRecharge"
            >
              充值余额
            </a-button>
          </template>
          <n-tab-pane name="消费记录">
            <desktop-user-wallet-recharge-expenses />
          </n-tab-pane>
          <n-tab-pane name="充值记录">
            <desktop-user-wallet-recharge-record />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
    <desktop-user-wallet-recharge-submit v-model:visible="showRecharge"  @done="openQrcodePayment"/>
    <desktop-user-wallet-recharge-submit-components-payment-qrcode v-model:visible="showQrcodePayment" :payment-result="paymentResult" />
  </div>
</template>

<style scoped lang="less">
.wallet-wrapper {
  position: relative;
  box-sizing: border-box;

  &>div {
    position: relative;
  }

  div {
    text-align: center;
    font-size: 16px;
    p {
      font-size: 24px;
      font-weight: 600;
    }

    .user-item-desc {
      font-size: 12px;
      color: #aaaeb3;
    }
  }
}

:deep(.n-tabs .n-tabs-bar) {
  height: 4px;
  bottom: 8px !important;
  border-radius: 4px !important;
}

:deep(.n-tabs .n-tabs-tab-pad) {
  width: 20px;
}
</style>