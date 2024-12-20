<script setup lang="ts">
import {onUnmounted, ref, watch} from 'vue'
import {message} from 'ant-design-vue'
import {onBeforeRouteLeave} from 'vue-router'
import {checkOrder} from "~/api/income/orders";
import type {PaymentResult} from "~/api/income/orders/model";
import {useMemberStore} from "~/store/useMemberStore";
import {getNameAndColor} from "~/utils/common-util";

const memberStore = useMemberStore()

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean
  paymentResult: PaymentResult | null
}>()

const emit = defineEmits<{
  (e: 'done'): void
  (e: 'update:visible', visible: boolean): void
}>()

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value)
}

const timer = ref()

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      /* 检测订单状态 */
      timer.value = setInterval(() => {
        checkOrder(props.paymentResult?.orderId).then((d) => {
          message.success(d)
          clearInterval(timer.value)
          memberStore.fetchMemberInfo()
          setTimeout(() => {
            updateVisible(false)
          }, 1000)
        }).catch((d) => {
          console.log(d.message)
        })
      }, 1000)

    } else {
      clearInterval(timer.value)
    }
  }
)

onUnmounted(() => {
  clearInterval(timer.value)
})

/**
 * 路由离开时触发
 */
onBeforeRouteLeave(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <a-drawer
    :open="visible"
    :width="320"
    :closable="false"
    title="余额扫码充值"
    :header-style="{ padding: '15px 20px' }"
    :body-style="{ padding: '20px' }"
    :footer-style="{ padding: '15px 20px' }"
    placement="right"
    class="no-drag"
    @close="updateVisible(false)"
  >
    <div v-if="paymentResult.paymentType === 'alipay'" class="bomaos-qrcode">
      <a-qrcode
          v-if="paymentResult?.paymentType == 'alipay'"
          :size="120"
          :icon-size="120 / 6"
          error-level="H"
          :value="paymentResult?.paymentUrl"
          :icon="getNameAndColor(paymentResult?.paymentType as string).icon"
      />
      <div style="margin-left: 15px">
        <div class="price" style="font-size: 20px; margin-bottom: 10px">金额：¥ {{ paymentResult?.totalAmount?.toFixed(2) }}</div>
        <div class="text-slate-400" style="font-size: 15px">
          请使用
          <span :style="{ color: getNameAndColor(paymentResult?.paymentType as string).color }">
            {{ getNameAndColor(paymentResult?.paymentType as string).name }}
          </span>
          扫码支付
        </div>
      </div>
    </div>
    <div style="margin-top: 15px">
      <n-alert :show-icon="false">
        <template #default>
          订单已提交、请尽快完成支付、在等待扫码的过程中客户端会自动检测支付状态、支付完成后会自动返回成功页面、以完成本次的支付。
        </template>
      </n-alert>
    </div>
    <template #footer>
      <div class="bomaos-row">
        <a-button size="large" @click="updateVisible(false)">取消支付</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped lang="less">
.bomaos-qrcode {
  display: flex;
  align-items: center;
}

[data-theme='dark'] .price {
  color: white;
}
</style>
