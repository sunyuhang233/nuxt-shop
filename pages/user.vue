<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-user v-if="$isDesktop() || $isTablet()"/>
    <mobile-user v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>