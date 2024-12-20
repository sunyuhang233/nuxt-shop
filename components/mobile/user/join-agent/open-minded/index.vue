<script setup lang="ts">
import {listPayConfigs} from "~/api/settings/pay-config";
import type {PayConfig} from "~/api/settings/pay-config/model";
import {type FormInst, NImage} from "naive-ui";
import {listAgentPackages} from "~/api/marketing/agent-package";
import type {AgentPackage} from "~/api/marketing/agent-package/model";
import {createAgentOrder} from "~/api/income/agent-orders";
import type {AgentOrders} from "~/api/income/agent-orders/model";
import type {PaymentResult} from "~/api/income/orders/model";
import {useMemberStore} from "~/store/useMemberStore";

const memberStore = useMemberStore()
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();

const agentPackageList = ref<AgentPackage[]>([]);
const agentPackageActiveType = ref<number>(0);
const paymentList = ref<PayConfig[]>([]);
const paymentActiveType = ref<number>(0);
const agentPackage = ref<AgentPackage>({});

//
const formRef = ref<FormInst | null>(null)

/**
 * 订单提交字段
 */
const { form } = useFormData<AgentOrders>({
  agentId: undefined,
  paymentType: '',
  transactionType: 1
})

await useAsyncData("read_agent_package", async () => listAgentPackages()).then((d) => {
  agentPackageList.value = d.data.value as AgentPackage[];
  agentPackage.value = (d.data.value as AgentPackage[])[0] as AgentPackage;
  agentPackageActiveType.value = agentPackageList.value[0].agentId as number;
  form.agentId = agentPackageList.value[0].agentId as number;
})

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
const onSwitchAgentPackage = (value: AgentPackage) => {
  agentPackage.value = value;
  agentPackageActiveType.value = value.agentId as number;
  form.agentId = value.agentId;
}

/**
 * 切换支付方式
 * @param value
 */
const onSwitchPayment = (value: PayConfig) => {
  paymentActiveType.value = value.id as number;
  form.paymentType = value.driver as string;
}

const rules = reactive({
  paymentType: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择支付方式'
  },
})

/**
 * 提交按钮加载
 */
const submitLoading = ref<boolean>(false);

// 开始前先开启加载
const starLoading = () => {
  submitLoading.value = true;
}

const showSubmitDialog = ref<boolean>(false);
const paymentResult = ref<PaymentResult>({});

/**
 * 提交订单，并且支付
 */
const onSubmit = () => {
  submitLoading.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '正在创建订单...',
      });
      createAgentOrder(form).then((d) => {
        closeToast();
        submitLoading.value = false;
        switch (d.paymentType) {
          case 'balance':
            memberStore.fetchMemberInfo().finally(() => {
              showNotify({ type: 'success', message: '使用余额支付成功！' });
            })
            break;
          default:
            showNotify({ type: 'success', message: '订单创建完成、正在前往支付' });
            setTimeout(() => {
              showSubmitDialog.value = true;
              paymentResult.value = d;
            }, 1000);
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
</script>

<template>
  <div class="boniu-card" style="padding: 20px">
    <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
    >
      <n-form-item :show-label="false" path="agentId">
        <n-row :gutter="[10, 10]">
          <n-col
              :span="12"
              v-for="agentPackage in agentPackageList"
              :key="agentPackage.agentId"
          >
            <common-check-item
                :checked="agentPackageActiveType == agentPackage.agentId"
                :on-toggle="() => onSwitchAgentPackage(agentPackage)"
            >
              <div
                  class="combo-btn"
                  style="display: flex; align-items: center; flex-direction: column"
              >
                <span class="name">{{ agentPackage.packageName }}</span>
                <div class="item-price mt-1">
                  <div class="top font-price">
                    <small>¥</small>
                    <span>{{ agentPackage.price }}</span>
                  </div>
                  <div class="bottom mt-1">
                    <del>¥<span>{{ agentPackage.costPrice }}</span></del>
                  </div>
                </div>
              </div>
            </common-check-item>
          </n-col>
        </n-row>
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
      <div>
        <n-button
            icon-placement="left"
            block
            strong
            secondary
            type="primary"
            size="large"
            :loading="submitLoading"
            @click="starLoading"
            v-debounce="onSubmit"
        >
          立即开通
        </n-button>
      </div>
    </n-form>
    <mobile-user-join-agent-submit-dialog
        v-model:visible="showSubmitDialog"
        :payment-result="paymentResult"
        :agent-package="agentPackage"
    />
  </div>
</template>

<style scoped lang="less">
.combo-btn {
  text-align: center;

  .pay-plugin-price-icon {
    border: 1px solid #ffffff;
    position: absolute;
    top: -12px;
    right: -2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 2px 6px;
    background: var(--bomaos-color-primary);
    border-radius: 8px;
    font-size: 12px;
    color: #ffffff;
    line-height: 16px;
    z-index: 20;
  }

  .name {
    font-weight: bold;
    font-size: 14px;
    color: #000;
    margin-bottom: 5px;
  }

  &.selected {
    border: 1px solid var(--bomaos-color-primary);
    color: var(--bomaos-color-primary);
    background: rgba(var(--bomaos-color-primary), 0.16);
  }

  .item-price {
    line-height: 1;
    .top {
      font-weight: bold;
      font-size: 24px;
      color: #000;
      margin-bottom: 5px;

      small {
        font-size: 60%;
        margin-right: 4px;
      }
    }
    .bottom {
      font-size: 14px;
      color: #848484;
    }
  }
}
</style>