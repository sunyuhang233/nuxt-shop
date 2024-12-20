<script setup lang="ts">
const props = defineProps<{
  // 弹窗是否打开
  description: string;
  height: string | '0px';
  isButton: boolean;
}>();
</script>

<template>
  <div
      :style="{
        backgroundColor: 'var(--bomaos-background-color)',
        borderRadius: '5px',
        height: height,
        padding: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }"
  >
    <n-empty :description="description">
      <template #icon>
        <slot name="icon"/>
      </template>
      <template v-if="isButton" #extra>
        <slot name="button"/>
      </template>
    </n-empty>
  </div>
</template>

<style scoped lang="less">
:deep(.n-empty__icon) {
  width: 64px;
  height: 41px;
}
</style>