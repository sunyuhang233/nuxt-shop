<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-user-spread v-if="$isDesktop() || $isTablet()"/>
    <mobile-user-spread v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>