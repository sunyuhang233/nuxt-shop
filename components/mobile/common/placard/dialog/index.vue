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

/* 关闭按钮 */
const beforeClose = () => {
  const isDialogMessage = useCookie("isDialogMessage", {
    maxAge: 60 * 60 * 24 * 7
  })
  isDialogMessage.value = 'true';
  updateVisible(false);
}
</script>

<template>
  <van-popup
      :show="visible"
      position="bottom"
      closeable
      :before-close="beforeClose"
  >
    <h3 style="margin-left: 20px; margin-top: 18px;">购前须知</h3>
    <van-divider />
    <div style="margin: 20px">
      <n-scrollbar style="max-height: 450px">
        <common-view-md :content="content as string" />
      </n-scrollbar>
    </div>
  </van-popup>
</template>

<style scoped lang="less">

</style>