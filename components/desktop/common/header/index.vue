<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";
const token = useCookie("token");
const setting = useSettingStore().setting as StoreSetting;
const { info } = storeToRefs(useMemberStore())
</script>

<template>
  <header>
    <div class="container main-header">
      <nuxt-link class="common-header--logo" to="/" style="letter-spacing: 0.2px; flex: 1 1 0%;">
        <img class="icon" width="35" height="35" :src="setting.websiteIcon ?? '~/assets/images/logo.svg'">
        <span>{{ setting.websiteName }}</span>
      </nuxt-link>
      <div class="common-header--nav">
        <div class="nav-item">
          <nuxt-link to="/" active-class="bomaos-this">商品购买</nuxt-link>
        </div>
        <n-divider vertical />
        <div class="nav-item">
          <nuxt-link to="/blog" active-class="bomaos-this">帮助中心</nuxt-link>
        </div>
        <n-divider vertical />
        <div class="nav-item">
          <nuxt-link to="/user/orders" active-class="bomaos-this">我的订单</nuxt-link>
        </div>
      </div>
      <div class="common-header--avatar" style="flex: 1 1 0%;">
        <nuxt-link v-if="!token && !info" to="/login" style="display: flex; align-items: center;">
          <button class="login-button">
            登录
            <div class="login-button-inner">
              <div class="login-button-line"></div>
              注册
            </div>
          </button>
        </nuxt-link>
        <nuxt-link v-else to="/user/orders" style="display: flex; align-items: center;">
          <button class="login-button">
            <div class="login-button-inner">
              个人中心
              <div class="login-button-line"></div>
            </div>
            <n-avatar
                round
                :size="23"
                object-fit="cover"
                :src="info?.avatar ? info?.avatar : '/assets/images/avatar.png'"
            />
          </button>
        </nuxt-link>
      </div>
    </div>
  </header>
</template>

<style scoped lang="less">
.login-button {
  background: rgba(30, 128, 255, 0.05);
  border: 1px solid rgba(30, 128, 255, 0.3);
  border-radius: 4px;
  padding-bottom: 4.8px;
  padding-left: 16px;
  padding-right: 10px;
  padding-top: 4.8px;
  color: #007fff;
  line-height: 24px;
  font-size: 14px;
  font-weight: 400;
  height: 35px;
  overflow: hidden;
  display: flex;
  cursor: pointer;

  .login-button-inner {
    display: inline-flex;
    align-items: center;

    .login-button-line {
      margin: 0 8px;
      background-color: #abcdff;
      height: 12px;
      width: 1px;
    }
  }
}
header {
  background-color: var(--bomaos-background-color);
  border-bottom: var(--bomaos-border-color);

  .main-header {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;

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

    .common-header--nav {
      display: flex;
      align-items: center;

      .nav-item {
        position: relative;
        display: inline-block;
        vertical-align: middle;

        :deep(.icon) {
          fill: #404040;
        }

        &>.bomaos-this {
          color: var(--bomaos-color-primary);

          &:after {
            width: 15px;
          }
        }

        a {
          color: #414141;
          font-size: 17px;
          font-weight: bold;
          padding: 0 5px;
          position: relative;
          cursor: pointer;
          display: block;
          transition: all .3s;
          -webkit-transition: all .3s;

          &:hover, &>.bomaos-this {
            color: var(--bomaos-color-primary);

            &:after {
              width: 15px;
            }
          }

          &:after {
            content: '';
            position: absolute;
            bottom: -9px;
            left: 0;
            right: 0;
            width: 0;
            margin: 0 auto;
            height: 4px;
            background-color: var(--bomaos-color-primary);
            border-radius: 2px;
            transition: width .2s ease-out;
          }

          .bomaos-this {
            &:after {
              width: 20%;
            }
          }
        }
      }
    }

    .common-header--avatar {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .mobile-img-border {
        display: flex;
        align-items: center;
      }
    }
  }
}

@keyframes logoLights {
  0% { left: -90px; top: 0; }
  to { left: 90px; top: 0; }
}
</style>