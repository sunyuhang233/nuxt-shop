<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-login v-if="$isDesktop() || $isTablet()"/>
    <mobile-login v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>