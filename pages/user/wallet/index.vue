<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-user-wallet v-if="$isDesktop() || $isTablet()"/>
    <mobile-user-wallet v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>