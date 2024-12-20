<template>
  <van-popup
      :show="visible"
      closeable
      position="bottom"
      :z-index="1999"
      :on-update:show="updateVisible"
      :before-close="beforeClose"
  >
    <template #default>
      <h3 style="margin-left: 20px; margin-top: 18px;">提现佣金</h3>
      <van-divider />
      <div style="margin: 20px">
        <n-alert :show-icon="false" type="warning">
          提交后将佣金余额全部提现到您的指定支付宝或USDT-TRC20账户"请认真填写收款信息", 最低{{ setting.minWithdrawAmount }}起可提现
        </n-alert>
        <n-form
            ref="formRef"
            :label-width="80"
            :model="form"
            :rules="rules"
            size="large"
            style="margin-bottom: 25px; margin-top: 20px"
        >
          <n-form-item label="选择收款类型" path="withdrawType">
            <n-select
                v-model:value="form.withdrawType"
                :options="options"
                :render-label="renderLabel"
                placeholder="请选择收款类型"
                size="large"
            />
          </n-form-item>
          <n-form-item
              :label="form.withdrawType === 'usdt' ? 'USDT-TRC20 收款地址' : '支付宝账号'"
              :rule="{
                  required: true,
                  message: form.withdrawType === 'usdt' ? '请输入USDT-TRC20 收款地址' : '请输入收款支付宝帐号',
                  trigger: ['input', 'blur']
                }"
              path="account"
          >
            <n-input
                v-model:value="form.account"
                :placeholder="form.withdrawType === 'usdt' ? '请输入USDT-TRC20 收款地址' : '请输入收款支付宝帐号'"
                size="large"
            />
          </n-form-item>
          <n-form-item v-if="form.withdrawType === 'alipay'" label="支付宝姓名" path="username">
            <n-input
                v-model:value="form.username"
                placeholder="请输入收款支付宝姓名"
                size="large"
            />
          </n-form-item>
          <van-button
              block
              type="primary"
              loading-text="正在提交中..."
              :loading="submitLoading"
              @click="starLoading"
              v-debounce="onSubmit"
          >
            立即提现
          </van-button>
        </n-form>
      </div>
    </template>
  </van-popup>
</template>

<script setup lang="ts">
import {ref, type VNodeChild, watch} from "vue";
import {createWithdraw} from "~/api/member/withdraw-record";
import {showNotify} from "vant";
import type {WithdrawRecordParam} from "~/api/member/withdraw-record/model";
import {type FormInst, NImage, type SelectOption} from "naive-ui";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;

const loading = ref(false);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

/* 关闭按钮 */
const beforeClose = () => {
  updateVisible(false);
}

const options = ref<SelectOption[]>([
  {
    label: 'USDT-TRC20',
    value: 'usdt'
  },
  {
    label: '支付宝',
    value: 'alipay'
  },
]);

const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return [
    h('div', { style: 'display: flex; align-items: center' }, [
          h(
              NImage,
              {
                width: '20px',
                height: '20px',
                fit: "cover",
                previewDisabled: true,
                src: '/assets/images/payment/' + option.value + '.svg'
              }
          ),
          h('div', { style: 'margin-left: 7px;'}, option.label as string)
        ]
    )
  ]
}

//
const formRef = ref<FormInst | null>(null)

const {form, resetFields} = useFormData<WithdrawRecordParam>({
  withdrawType: 'usdt',
  account: '',
  username: ''
});

const rules = reactive({
  withdrawType: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择收款类型'
  },
  username: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入收款支付宝姓名'
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
      /* 发起提现 */
      createWithdraw(form).then((res) => {
        submitLoading.value = false;
        showNotify({ type: 'success', message: res });
        updateVisible(false);
      }).catch((error) => {
        submitLoading.value = false;
        showNotify({ type: 'warning', message: error.message });
      })
    } else {
      submitLoading.value = false;
    }
  })
};

/* 监听 重置数据 */
watch(() => props.visible, (visible) => {
  if (visible) {
    resetFields();
  }
})
</script>

<style scoped lang="less">

</style>