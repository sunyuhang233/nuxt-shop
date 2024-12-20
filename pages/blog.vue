<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
</script>

<template>
  <div>
    <desktop-blog v-if="$isDesktop() || $isTablet()"/>
    <mobile-blog v-if="$isMobile()"/>
  </div>
</template>

<style scoped lang="less">

</style>