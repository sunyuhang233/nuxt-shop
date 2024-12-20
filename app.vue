<script setup lang="ts">
import { Crisp } from "crisp-sdk-web";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";


useSettingStore().fetchSettingInfo();
const setting = useSettingStore().setting as StoreSetting;

const { $isMobile } = useNuxtApp();

if (process.client) {
  if (setting.enableCrisp == 1) {
    Crisp.configure('7a9c6f28-4554-460c-bd2b-1650259678d7', {
      autoload: false
    });
    Crisp.load();
  }
}
</script>

<template>
  <NuxtLayout :name="$isMobile() ? 'mobile-default' : 'desktop-default'">
    <nuxt-page />
  </NuxtLayout>
</template>

<style scoped lang="less">

</style>
