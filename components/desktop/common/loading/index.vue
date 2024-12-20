<script setup lang="ts">

</script>

<template>
  <div class="loading-wave">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<style scoped lang="less">
.loading-wave {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 332px); /* 调整为需要的高度 */
}

.dot {
  width: 10px;
  height: 10px;
  background-color: var(--bomaos-color-primary);
  border-radius: 50%;
  margin: 0 5px;
  animation: wave 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: -0.25s;
}

.dot:nth-child(3) {
  animation-delay: -0.5s;
}

.dot:nth-child(4) {
  animation-delay: -0.75s;
}

@keyframes wave {
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-15px);
  }
}
</style>