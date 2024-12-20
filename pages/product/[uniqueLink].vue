<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
const { params } = useRoute();
</script>

<template>
  <div>
    <desktop-product v-if="$isDesktop() || $isTablet()" :unique-link="params.uniqueLink as string"/>
    <mobile-product v-if="$isMobile()" :unique-link="params.uniqueLink as string"/>
  </div>
</template>

<style scoped lang="less">

</style>