<script setup lang="ts">
// themeVars 内的值会被转换成对应 CSS 变量
// 比如 sliderBarHeight 会转换成 `--van-slider-bar-height`
import {NConfigProvider, lightTheme, type LayoutInst, zhCN} from 'naive-ui';
import { Crisp } from "crisp-sdk-web";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;

const contentRef = ref<LayoutInst | null>(null);
const route = useRoute();

watchEffect(() => {
  console.log(route.path);
  contentRef.value?.scrollTo({ top: 0 });
});

const themeVars = reactive({
  primaryColor: '#409EFF',
  rateIconFullColor: '#409EFF',
  sliderActiveBackground: '#409EFF',
  buttonPrimaryBackground: '#409EFF',
  buttonPrimaryBorderColor: '#409EFF',
});

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

const handleClick = () => {
  Crisp.chat.open()
}
</script>

<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides" :theme="lightTheme">
      <van-config-provider theme="light" :theme-vars="themeVars">
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
            <n-layout position="absolute">
              <n-layout-header bordered>
                <mobile-common-header/>
              </n-layout-header>
              <n-layout
                  ref="contentRef"
                  position="absolute"
                  style="top: 66px; bottom: 70px; background-color: #f7f7f7"
                  :native-scrollbar="true"
              >
                <nuxt-page/>
                <button
                    v-if="setting.enableCrisp == 1"
                    style="right:15px;bottom:85px;"
                    class="ant-float-btn ant-float-btn-primary ant-float-btn-circle css-dev-only-do-not-override-u4kgz5"
                    type="button"
                    @click="handleClick"
                >
              <span class="ant-badge css-dev-only-do-not-override-u4kgz5">
                <div class="ant-float-btn-body">
                  <div class="ant-float-btn-content">
                    <div class="ant-float-btn-icon">
                      <span role="img" aria-label="customer-service" class="anticon anticon-customer-service">
                        <svg focusable="false" style="" data-icon="customer-service" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                          <path d="M512 128c-212.1 0-384 171.9-384 384v360c0 13.3 10.7 24 24 24h184c35.3 0 64-28.7 64-64V624c0-35.3-28.7-64-64-64H200v-48c0-172.3 139.7-312 312-312s312 139.7 312 312v48H688c-35.3 0-64 28.7-64 64v208c0 35.3 28.7 64 64 64h184c13.3 0 24-10.7 24-24V512c0-212.1-171.9-384-384-384zM328 632v192H200V632h128zm496 192H696V632h128v192z"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </span>
                </button>
              </n-layout>
              <n-layout-footer
                  bordered
                  position="absolute"
                  style="height: 70px;"
              >
                <mobile-common-tabbar/>
              </n-layout-footer>
            </n-layout>
          </a-config-provider>
        </a-extract-style>
      </van-config-provider>
    </n-config-provider>
  </div>
</template>

<style scoped lang="less">
.ant-float-btn {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
  border: none;
  position: fixed;
  cursor: pointer;
  z-index: 99;
  display: block;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  inset-inline-end: 24px;
  inset-block-end: 48px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  .ant-float-btn-body {
    .ant-float-btn-content {
      overflow: hidden;
      text-align: center;
      min-height: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2px 4px;

      .ant-float-btn-icon {
        color: #fff;
      }

      .ant-float-btn-icon {
        text-align: center;
        margin: auto;
        width: 18px;
        font-size: 18px;
        line-height: 1;
      }
    }
  }

}

.ant-float-btn-primary {
  background-color: var(--bomaos-color-primary);

  .ant-float-btn-body {
    background-color: var(--bomaos-color-primary);
    transition: background-color 0.2s;
  }
}

.ant-float-btn-circle {
  height: 40px;
  border-radius: 50%;

  .ant-float-btn-body {
    border-radius: 50%;
  }
}

.ant-float-btn .ant-badge {
  width: 100%;
  height: 100%;
}

.ant-badge {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1;
  list-style: none;
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
  position: relative;
  display: inline-block;
  width: fit-content;
}
</style>