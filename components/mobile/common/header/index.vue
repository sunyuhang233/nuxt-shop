<script setup lang="ts">
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;

const visible = ref<boolean>(false);

const openPlacardDialog = () => {
  visible.value = true;
};
</script>

<template>
  <van-sticky :offset-top="0">
    <div class="bomaos-nav" safe-area-inset-top>
      <nuxt-link class="common-header--logo" to="/" style="letter-spacing: 0.2px; flex: 1 1 0%;">
        <img class="icon" width="35" height="35" :src="setting.websiteIcon ?? '~/assets/images/logo.svg'">
        <span>{{ setting.websiteName }}</span>
      </nuxt-link>
      <a-button size="middle" @click="openPlacardDialog" round>购前须知</a-button>
    </div>
  </van-sticky>
  <mobile-common-placard-dialog v-model:visible="visible" :content="setting.dialogMessage"/>
</template>

<style scoped lang="less">
.bomaos-nav {
  padding: 0 15px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  background-color: #fff;
  border-bottom: var(--bomaos-border-color);

  .common-header--logo {
    height: 100%;
    font-size: 22px;
    font-weight: bold;
    color: #131313;
    margin-right: 10px;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 150px;
      height: 10px;
      background-color: rgba(255,255,255,.5);
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-animation: logoLights 1s ease-in 1s infinite;
      animation: logoLights 1s ease-in 1s infinite;
    }

    span {
      margin-left: 10px;
    }

    span, img {
      vertical-align: middle;
    }
  }
}
@keyframes logoLights {
  0% { left: -90px; top: 0; }
  to { left: 90px; top: 0; }
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>