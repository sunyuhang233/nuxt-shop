<script setup lang="ts">
import {type FormInst, NImage} from "naive-ui";
import type {PayConfig} from "~/api/settings/pay-config/model";
import {listPayConfigs} from "~/api/settings/pay-config";
import type {RechargeParam} from "~/api/income/recharge-record/model";
import {createRechargeRecord} from "~/api/income/recharge-record";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import type {PaymentResult} from "~/api/income/orders/model";

const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();

const setting = useSettingStore().setting as StoreSetting;

const emit = defineEmits<{
  (e: 'done', paymentResult: PaymentResult): void
  (e: 'update:visible', visible: boolean): void;
}>();

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

/* 关闭按钮 */
const beforeClose = () => {
  updateVisible(false);
}

const paymentActiveType = ref<number>(0);
const paymentList = ref<PayConfig[]>([]);

/**
 * 获取支付渠道列表
 */
await useAsyncData("read_pay_config", async () => listPayConfigs()).then((d) => {
  paymentList.value = d.data.value.filter((config) => {
    if ($isMobile() || $isTablet()) {
      return config.isMobile === 1; // 过滤支持移动端的配置
    } else if ($isDesktop()) {
      return config.isDesktop === 1; // 过滤支持电脑端的配置
    }
    return false; // 如果设备类型不明确，不显示任何配置
  });
})

/**
 * 切换支付方式
 * @param value
 */
const onSwitchPayment = (value: PayConfig) => {
  paymentActiveType.value = value.id as number;
  form.paymentType = value.driver as string;
}

//
const formRef = ref<FormInst | null>(null)

// 表单数据
const {form, resetFields} = useFormData<RechargeParam>({
  money: setting.minDepositAmount,
  paymentType: ''
});

const rules = reactive({
  money: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入要充值的金额'
  },
  paymentType: {
    required: true,
    trigger: ['input'],
    message: '请选择付款方式'
  }
})

/**
 * 提交按钮加载
 */
const submitLoading = ref<boolean>(false);

// 开始前先开启加载
const starLoading = () => {
  submitLoading.value = true;
}

const onSubmit = () => {
  submitLoading.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '正在创建订单...',
      });
      createRechargeRecord(form).then((d) => {
        closeToast();
        submitLoading.value = false;
        switch (d.paymentType) {
          case 'alipay':
            showNotify({ type: 'success', message: '订单创建完成、请扫码完成支付' });
            setTimeout(() => {
              updateVisible(false)
              emit('done', d as PaymentResult)
            }, 1000)
            break
          default:
            showNotify({ type: 'success', message: '订单创建完成、正在前往支付' });
            openUrl(d.paymentUrl as string);
            break;
        }
      }).catch((error) => {
        closeToast();
        submitLoading.value = false;
        showNotify({ type: 'warning', message: error.message });
      })
    } else {
      submitLoading.value = false;
    }
  })
}

/* 打开支付链接 */
const openUrl = (url: string) => {
  window.open(url, '_blank')
}

watch(() => props.visible, (visible) => {
  if (visible) {
    console.log(111)
  } else {
    resetFields();
  }
})
</script>

<template>
  <!-- 底部弹出 -->
  <van-popup
      :show="visible"
      position="bottom"
      closeable
      :before-close="beforeClose"
  >
    <h3 style="margin-left: 20px; margin-top: 18px;">充值余额</h3>
    <van-divider />
    <div style="margin: 20px">
      <n-alert :show-icon="false" type="warning">
        在我们的平台上，余额充值服务提供了一种快速、便捷的方式来为您的账户增加资金。无论您是需要购买产品、支付服务费用，还是仅仅希望保持账户中有充足的预存款，我们的充值服务都能满足您的需求。
      </n-alert>
      <n-form
          ref="formRef"
          :label-width="80"
          :model="form"
          :rules="rules"
          size="large"
          style="margin-bottom: 25px; margin-top: 20px"
      >
        <n-form-item label="充值金额" path="money">
          <n-input-number
              v-model:value="form.money"
              :min="setting.minDepositAmount"
              :default-value="setting.minDepositAmount"
              size="large"
              style="width: 100%"
              placeholder="请输入要充值的金额"
          >
            <template #prefix>
              ￥
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="支付方式" path="paymentType">
          <n-row :gutter="[10, 10]">
            <n-col
                :span="24"
                v-for="payment in paymentList"
                :key="payment.id"
            >
              <common-check-item
                  :checked="paymentActiveType == payment.id"
                  :on-toggle="() => onSwitchPayment(payment)"
              >
                <div
                    class="payment-btn"
                    style="display: flex; align-items: center; justify-content: center"
                >
                  <n-image
                      width="20"
                      height="20"
                      object-fit="contain"
                      :src="getNameAndColor(payment?.driver as string).icon"
                      :preview-disabled="true"
                  />
                  <span style="margin-left: 8px; font-size: 17px">{{ payment.name }}</span>
                </div>
              </common-check-item>
            </n-col>
          </n-row>
        </n-form-item>
        <van-button
            block
            type="primary"
            :loading="submitLoading"
            @click="starLoading"
            v-debounce="onSubmit"
        >
          立即充值
        </van-button>
      </n-form>
    </div>
  </van-popup>
</template>