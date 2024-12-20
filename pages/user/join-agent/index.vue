<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-user-join-agent v-if="$isDesktop() || $isTablet()"/>
    <mobile-user-join-agent v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>