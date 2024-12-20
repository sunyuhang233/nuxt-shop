<template>
  <n-modal
      :show="visible"
      preset="dialog"
      :showIcon="false"
      :closable="true"
      :mask-closable="true"
      :block-scroll="false"
      style="width: 350px; padding: 0; border-radius: 15px; line-height: 1.2; overflow: hidden;"
      :on-update:show="updateVisible"
      :z-index="1000"
  >
    <h3 style="margin-left: 20px; margin-top: 18px;">划转佣金到余额</h3>
    <van-divider />
    <div style="margin: 20px">
      <n-alert :show-icon="false" type="warning">
        划转后的金额将进入余额、不可提现，仅用于站内消费。
      </n-alert>
      <n-form
          ref="formRef"
          :label-width="80"
          :model="form"
          :rules="rules"
          size="large"
          style="margin-bottom: 25px; margin-top: 20px"
      >
        <n-form-item label="划转金额" path="money">
          <n-input-number
              v-model:value="form.money"
              size="large"
              style="width: 100%"
              placeholder="请输入要划转的金额"
          >
            <template #prefix>
              ￥
            </template>
          </n-input-number>
        </n-form-item>
        <n-button
            strong
            secondary
            block
            type="primary"
            size="large"
            :loading="submitLoading"
            @click="starLoading"
            v-debounce="onSubmit"
        >
          确定划转
        </n-button>
      </n-form>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {transferMoney} from "@/api/member/spread";
import type {TransferMoneyParam} from "@/api/member/spread/model";
import {type FormInst, useMessage} from "naive-ui";

const message = useMessage();

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

//
const formRef = ref<FormInst | null>(null)

// 表单数据
const {form, resetFields} = useFormData<TransferMoneyParam>({
  money: undefined
});

const rules = reactive({
  money: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入要划转的金额'
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

/* 提交需要划转的金额 */
const onSubmit = () => {
  submitLoading.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      transferMoney(form).then((res) => {
        submitLoading.value = false;
        message.success(res as string);
        updateVisible(false);
      }).catch((error) => {
        submitLoading.value = false;
        message.warning(error.message);
      })
    } else {
      submitLoading.value = false;
    }
  })
}

/* 监听 重置数据 */
watch(() => props.visible, (visible) => {
  if (visible) {
    form.money = undefined;
  }
})
</script>

<style scoped lang="less">

</style>