<script setup lang="ts">
const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  content: string;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};
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
    <h3 style="margin-left: 20px; margin-top: 18px;">购前须知</h3>
    <van-divider />
    <div style="margin: 20px">
      <n-scrollbar style="max-height: 350px">
        <common-view-md :content="content as string" />
      </n-scrollbar>
      <van-divider style="margin-bottom: 20px"/>
      <div class="bomaos-row">
        <n-button
            block
            size="large"
            type="primary"
            style="flex-shrink: inherit"
            @click="updateVisible(false)"
        >
          我已查看知晓
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<style scoped lang="less">
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