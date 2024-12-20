<script setup lang="ts">
const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();

const route = useRoute();
const sid = route.query.sid;

if (sid) {
  const token = useCookie("sid", {
    maxAge: 60 * 60 * 24 * 7
  })
  token.value = sid as string;
}
</script>

<template>
  <div>
    <desktop-home v-if="$isDesktop() || $isTablet()"/>
    <mobile-home v-if="$isMobile()"/>
  </div>
</template>

<style scoped>

</style>