<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-user-orders v-if="$isDesktop() || $isTablet()"/>
    <mobile-user-orders v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>