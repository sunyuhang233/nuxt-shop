<script setup lang="ts">
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const token = useCookie("token");

const setting = useSettingStore().setting as StoreSetting;
if (!setting) {
  useSettingStore().fetchSettingInfo()
}
</script>

<template>
  <div class="taotu-placard">
    <div class="container">
      <div class="taotu-header">
        <div class="content">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><g fill="currentColor"><path d="M13 4.703c0-1.857-2.31-2.711-3.519-1.301L5.84 7.65a1 1 0 0 1-.76.35H5a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.08a1 1 0 0 1 .76.35l3.641 4.248c1.209 1.41 3.519.556 3.519-1.301V4.703zm-5.642 4.25L11 4.702v14.594l-3.642-4.25A3 3 0 0 0 5.08 14H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.08a3 3 0 0 0 2.278-1.048zm11.278-4.678a1 1 0 1 0-1.377 1.45c3.655 3.472 3.655 9.078 0 12.55a1 1 0 0 0 1.377 1.45c4.485-4.26 4.485-11.19 0-15.45zm-2.947 2.8a1 1 0 1 0-1.378 1.45c2.027 1.925 2.027 5.025 0 6.95a1 1 0 0 0 1.378 1.45c2.857-2.714 2.857-7.136 0-9.85z"/></g></svg>
          <div style="margin-left: 5px">{{ setting.urgentMessage }}</div>
        </div>
        <div class="nav">
          <div v-if="!token" class="bomaos-nav-item">
            <nuxt-link to="/login" active-class="bomaos-this">登陆/注册</nuxt-link>
          </div>
          <n-divider v-if="!token"  vertical style="height: 10px; background-color: rgb(108 108 108);"/>
          <!--          <a-divider type="vertical" style="height: 10px; background-color: rgb(108 108 108);"/>-->
          <div class="bomaos-nav-item">
            <nuxt-link to="/user/orders" active-class="bomaos-this">我的订单</nuxt-link>
          </div>
          <n-divider vertical style="height: 10px; background-color: rgb(108 108 108);"/>
<!--          <a-divider type="vertical" style="height: 10px; background-color: rgb(108 108 108);"/>-->
          <div class="bomaos-nav-item">
            <nuxt-link to="/blog" active-class="bomaos-this">帮助文档</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.taotu-placard {
  padding: 8px 0;
  background-color: #161616;
  .container {
    .taotu-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      .content {
        display: flex;
        align-items: center;
        color: #cdcdcd;
      }
      .nav {
        display: flex;
        align-items: center;
        .bomaos-nav-item {
          a {
            color: #cdcdcd;
          }
        }
      }
    }
  }
}
</style>