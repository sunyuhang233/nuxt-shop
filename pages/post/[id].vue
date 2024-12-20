<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();
const { params } = useRoute();
</script>

<template>
  <div>
    <desktop-blog-post v-if="$isDesktop() || $isTablet()" :article-id="params.id as number"/>
    <mobile-blog-post v-if="$isMobile()" :article-id="params.id as number"/>
  </div>
</template>

<style scoped lang="less">

</style>