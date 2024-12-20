<script setup lang="ts">
import type {PaymentResult} from "~/api/income/orders/model";
import type {Product} from "~/api/product/product/model";
import type {Category} from "~/api/product/category/model";
import {getNameAndColor} from "~/utils/common-util";
import {checkOrder} from "~/api/income/orders";

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  paymentResult: PaymentResult;
  product: Product;
  category: Category;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

const intervalId = ref<number | null>(null); // 用于存储定时器 ID

const checkOrderPeriodically = async (orderId: number) => {
  checkOrder(orderId).then((d) => {
    message.success(d)
    navigateTo('/user/orders')
  }).catch((d) => {
    console.log(d.message)
  })
};

const startChecking = () => {
  if (intervalId.value === null && props.paymentResult.paymentType === 'alipay') {
    intervalId.value = setInterval(() => {
      checkOrderPeriodically(props.paymentResult.orderId);
    }, 1000); // 每秒调用一次
  }
};

const stopChecking = () => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

// 监听弹窗可见状态
watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        startChecking();
      } else {
        stopChecking();
      }
    }
);

// 组件销毁时清除定时器
onUnmounted(() => {
  stopChecking();
});
</script>

<template>
  <n-modal
      :show="visible"
      preset="dialog"
      :showIcon="false"
      :closable="true"
      :mask-closable="false"
      :block-scroll="false"
      style="width: 350px; padding: 0; border-radius: 15px; line-height: 1.2; overflow: hidden;"
      :on-update:show="updateVisible"
      :z-index="1000"
  >
    <h3 style="margin-left: 20px; margin-top: 18px;">{{ paymentResult.paymentType === 'alipay' ? '扫码支付' : '确认订单' }}</h3>
    <van-divider />
    <div style="margin: 20px">
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
      <van-divider v-if="paymentResult.paymentType === 'alipay'" />
      <div class="weui-form-preview__hd">
        <div class="weui-form-preview__item">
          <label class="weui-form-preview__label">付款金额</label>
          <em class="weui-form-preview__value">￥ {{ paymentResult.totalAmount.toFixed(2) }}</em>
        </div>
      </div>
      <van-divider />
      <div class="weui-form-preview__bds">
        <div class="weui-form-preview__items">
          <label class="weui-form-preview__labels">订单号</label>
          <span class="weui-form-preview__values">{{ paymentResult.orderId }}</span>
        </div>
        <div class="weui-form-preview__items">
          <label class="weui-form-preview__labels">商品单价</label>
          <span class="weui-form-preview__values">{{ (product.categoryEnabled == 0 ? product.price : category.price).toFixed(2) }}</span>
        </div>
        <div class="weui-form-preview__items">
          <label class="weui-form-preview__labels">支付方式</label>
          <span class="weui-form-preview__values" :style="{color: getNameAndColor(paymentResult.paymentType as string)?.color}">
            {{ getNameAndColor(paymentResult.paymentType as string)?.name }}
          </span>
        </div>
        <div class="weui-form-preview__items">
          <label class="weui-form-preview__labels">说明</label>
          <span class="weui-form-preview__values">订单已提交请尽快完成支付!</span>
        </div>
      </div>
      <van-divider style="margin-bottom: 20px"/>
      <div class="bomaos-row">
        <n-button
            :block="paymentResult.paymentType === 'alipay'"
            style="flex-shrink: inherit"
            size="large"
            @click="navigateTo('/user/orders')"
        >
          付款完成
        </n-button>
        <n-button
            v-if="paymentResult.paymentType !== 'alipay'"
            block
            size="large"
            type="primary"
            tag="a"
            :href="paymentResult.paymentUrl"
            target="_blank"
            style="flex-shrink: inherit"
        >
          立即前往支付
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<style scoped lang="less">
.bomaos-qrcode {
  display: flex;
  align-items: center;
}
.weui-form-preview__hd {
  position: relative;
  text-align: right;
  line-height: 2.5em;
  font-size: 16px;

  .weui-form-preview__item {
    overflow: hidden;

    .weui-form-preview__label {
      float: left;
      margin-right: 1em;
      min-width: 4em;
      color: rgba(0, 0, 0, 0.5);
      text-align: justify;
    }

    .weui-form-preview__value {
      font-style: normal;
      font-size: 16px;
      font-weight: bold;
      display: block;
      overflow: hidden;
      word-break: normal;
      word-wrap: break-word;
      color: var(--bomaos-color-primary);
    }
  }
}

.weui-form-preview__bds {
  font-size: 16px;
  text-align: right;
  color: rgba(0,0,0,0.5);
  line-height: 2;
  .weui-form-preview__items {
    overflow: hidden;

    .weui-form-preview__labels {
      float: left;
      margin-right: 1em;
      min-width: 4em;
      color: rgba(0,0,0,0.6);
      text-align: justify;
      text-align-last: justify;

      &:after {
        content: '';
        width: 100%;
      }
    }

    .weui-form-preview__values {
      display: block;
      overflow: hidden;
      word-break: normal;
      word-wrap: break-word;
      color: rgba(0,0,0,0.5);
    }
  }
}

.weui-form-preview__buttom {
  font-size: 1.2em;
  text-align: center;
  color: rgba(0,0,0,0.5);
  /* color: var(--weui-FG-1); */
  line-height: 2;
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