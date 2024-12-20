<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error">
    <n-result :status="'' + error.statusCode + ''" :title="error.statusCode" :description="error.statusMessage">
      <template #footer>
        <n-button @click="handleError">回到首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<style scoped lang="less">
.error {
  min-height: calc(100vh - 0px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>