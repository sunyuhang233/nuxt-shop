<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import type {PaymentResult} from "~/api/income/orders/model";

const setting = useSettingStore().setting as StoreSetting;

const { info } = storeToRefs(useMemberStore());
/* 数据列表 star */
const active = ref(0);

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
    <div class="bomao-cost">
      <div class="balance">
        <div class="text">
          <span>零钱余额</span>
          <div>
            <span style="font-size: 30px; color: #0e0e10;">¥</span>
            {{ info?.balance?.toFixed(2) }}
          </div>
        </div>
        <van-divider dashed :style="{ borderColor: '#dcdcdc'}"/>
        <div class="handler">
          <div class="coin-list">
            <div class="coin-item">
              <a style=" font-size: 16px; color: var(--bomaos-color-primary)">¥{{ (info?.balance - info?.freezeBalance).toFixed(2) }}</a>
              <span>剩余余额</span>
            </div>
            <n-divider vertical style="margin: 0 10px"/>
            <div class="coin-item">
              <a style=" font-size: 16px; color: var(--bomaos-color-primary)">￥{{ info?.freezeBalance?.toFixed(2) }}</a>
              <span>冻结余额</span>
            </div>
          </div>
          <n-button type="primary" round strong secondary @click="onRecharge">
            充值余额
          </n-button>
        </div>
        <mobile-user-wallet-recharge-submit v-model:visible="showRecharge"  @done="openQrcodePayment"/>
        <mobile-user-wallet-recharge-submit-components-payment-qrcode v-model:visible="showQrcodePayment" :payment-result="paymentResult" />
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
      <van-tab title="消费记录">
        <mobile-user-wallet-recharge-expenses />
      </van-tab>
      <van-tab title="充值记录">
        <mobile-user-wallet-recharge-record />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped lang="less">
.bomao-cost {
  background-color: white;
  padding: 15px;
  border-bottom: 1px solid #f3f3f3;
}

.bomao-cost .balance {
  padding: 15px;
  border-radius: 8px;
  background: #f7f8fc;
  position: relative;
}

.bomao-cost .balance .text span {
  font-size: 15px;
  color: #707075;
}

.bomao-cost .balance .text div {
  margin-top: 10px;
  line-height: 1;
  font-weight: 600;
  font-size: 47px;
  color: #0e0e10;
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.bomao-cost .balance {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.bomaos-icon {
  position: absolute;
  width: 70px;
  height: 70px;
  right: 15px;
  top: 15px;
}

.coin-list {
  display: flex;
  align-items: center;
}

.coin-item {
  font-size: 12px;
  color: #666666;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coin-item a {
  color: #18a058;
}

.handler {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>