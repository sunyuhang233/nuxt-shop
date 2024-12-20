<script setup lang="ts">
import { NConfigProvider, lightTheme, zhCN, dateZhCN } from 'naive-ui';
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";
const setting = useSettingStore().setting as StoreSetting;
const route = useRoute();

/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  common: {
    primaryColor: '#409EFF',
    primaryColorHover: '#409EFF',
    borderRadius: '5px'
  },
  Button: {
    textColor: '#409EFF'
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#409EFF'
      }
    }
  },
  Tag: {
    borderRadius: '5px'
  }
}

const visible = ref<boolean>(false);

onMounted(() => {
  if (setting.isDialogMessage == 1 && route.fullPath === '/') {
    setTimeout(() => {
      visible.value = true;
    }, 500)
  }
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="lightTheme" :locale="zhCN" :date-locale="dateZhCN">
    <n-dialog-provider>
      <n-message-provider>
        <a-extract-style>
          <a-config-provider
              :locale="zhCN"
              :theme="{
                token: {
                  colorPrimary: '#2b66cb'
                  }
              }"
          >
            <NuxtLoadingIndicator />
            <a-affix :offset-top="0">
              <desktop-common-placard />
              <desktop-common-header />
            </a-affix>
            <main>
              <nuxt-page />
            </main>
            <footer>
              <desktop-common-footer />
            </footer>
            <desktop-common-placard-dialog v-if="setting.isDialogMessage == 1" v-model:visible="visible" :content="setting.dialogMessage"/>
          </a-config-provider>
        </a-extract-style>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>