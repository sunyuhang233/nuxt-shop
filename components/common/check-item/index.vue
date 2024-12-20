<script setup lang="ts">
const props = defineProps<{
  // 弹窗是否打开
  checked?: boolean
  onToggle?: () => void // 父组件传入的切换函数
}>()
</script>

<template>
  <div
    class="bomaos-check-card is-bordered"
    :class="{ 'is-checked': checked }"
    style="padding: 10px 15px"
    @click="props.onToggle"
  >
    <slot />
    <div v-if="checked" class="bomaos-check-card-arrow"></div>
  </div>
</template>

<style scoped lang="less">
.bomaos-check-card {
  --bomaos-check-card-radius: 6px;
  --bomaos-check-card-border-color: #dddddd;
  --bomaos-check-card-hover-border-color: var(--bomaos-color-primary);
  --bomaos-check-card-hover-bg: transparent;
  --bomaos-check-card-active-border-color: var(--bomaos-color-primary);
  --bomaos-check-card-active-bg: rgba(64, 158, 255, 0.16);
  --bomaos-check-card-disabled-border-color: #e8e8e8;
  --bomaos-check-card-disabled-bg: #f5f5f5;
  --bomaos-check-card-disabled-opacity: 0.75;
  --bomaos-check-card-arrow-color: var(--bomaos-color-primary);
  --bomaos-check-card-arrow-size: 6px;
  --bomaos-check-card-arrow-radius: 4px;
  --bomaos-check-card-arrow-disabled-color: #e8e8e8;
}

[data-theme='dark'] .bomaos-check-card {
  --bomaos-check-card-radius: 6px;
  --bomaos-check-card-border-color: var(--bomaos-color-primary);
  --bomaos-check-card-hover-border-color: var(--bomaos-color-primary);
  --bomaos-check-card-hover-bg: transparent;
  --bomaos-check-card-active-border-color: var(--bomaos-color-primary);
  --bomaos-check-card-active-bg: rgba(64, 158, 255, 0.05);
  --bomaos-check-card-disabled-border-color: #e8e8e8;
  --bomaos-check-card-disabled-bg: #f5f5f5;
  --bomaos-check-card-disabled-opacity: 0.75;
  --bomaos-check-card-arrow-color: var(--bomaos-color-primary);
  --bomaos-check-card-arrow-size: 6px;
  --bomaos-check-card-arrow-radius: 4px;
  --bomaos-check-card-arrow-disabled-color: #e8e8e8;
}

.bomaos-check-card {
  box-sizing: border-box;
  transition:
    color 0.2s,
    border-color 0.2s,
    border-width 0.2s,
    box-shadow 0.2s;
  position: relative;
  cursor: pointer;
}

.bomaos-check-card.is-bordered {
  border: 1px solid var(--bomaos-check-card-border-color);
  border-radius: var(--bomaos-check-card-radius);
}

.bomaos-check-card .bomaos-check-card-arrow {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 0;
  height: 0;
  border: var(--bomaos-check-card-arrow-size) solid transparent;
  border-top-color: var(--bomaos-check-card-arrow-color);
  border-right-color: var(--bomaos-check-card-arrow-color);
  border-top-right-radius: var(--bomaos-check-card-arrow-radius);
  box-sizing: border-box;
  display: none;
}

.bomaos-check-card.is-checked > .bomaos-check-card-arrow {
  display: block;
}

.bomaos-check-card.is-checked {
  background: var(--bomaos-check-card-active-bg);
}

.bomaos-check-card.is-bordered.is-checked {
  border-color: var(--bomaos-check-card-active-border-color);
}
</style>
