<template>
  <div class="bomaos-footer">
    <div class="start-box">
      <div class="container">
        <div class="auto-width join-apy-wrap sm-p-lr-15">
          <ul style="margin-bottom: 0px">
            <n-row gutter="15">
              <n-col :span="6" v-for="(item, index) in JSON.parse(setting.storeServiceConfig as string)" :key="index" >
                <li :class="{ 'box-sizing-show': index !== (JSON.parse(setting.storeServiceConfig as string).length - 1) }">
                  <template v-html="item.icon"></template>
                  <div>
                    <h3 class="font-weight-bold font-size-24">{{ item.name }}</h3>
                    <p class="color-main-596680">{{ item.summary }}</p>
                  </div>
                </li>
              </n-col>
            </n-row>
          </ul>
        </div>
      </div>
    </div>
    <div class="bomaos-tools-widget">
      <div class="container" style="display: flex">
        <n-row gutter="15">
          <n-col :span="6">
            <nav style="margin-right: 15px">
              <div class="title">平台简介</div>
              <div class="turn" style="color: #666; line-height: 1.5;">
                {{ setting.introduction }}
              </div>
            </nav>
          </n-col>
          <n-col :span="3">
            <nav>
              <div class="title">功能导航</div>
              <div class="turn" style="color: #666">
                <nuxt-link to="/user/orders">我的订单</nuxt-link>
                <nuxt-link to="/user/spread">邀请好友</nuxt-link>
                <nuxt-link to="/blog">帮助文档</nuxt-link>
              </div>
            </nav>
          </n-col>
          <n-col :span="3">
            <nav>
              <div class="title">条款政策</div>
              <div class="turn" style="color: #666">
                <nuxt-link to="/agreement/privacy">隐私政策</nuxt-link>
                <nuxt-link to="/agreement/user">用户协议</nuxt-link>
              </div>
            </nav>
          </n-col>
          <n-col :span="6">
            <nav>
              <div class="title">工作时间</div>
              <div class="turn" style="color: #666">
                <div>{{JSON.parse(setting.workTimeConfig as string).operatingHours}}</div>
                <div>{{JSON.parse(setting.workTimeConfig as string).weekends}}</div>
                <div>{{JSON.parse(setting.workTimeConfig as string).description}}</div>
              </div>
            </nav>
          </n-col>
          <n-col :span="6">
            <nav>
              <div class="title">联系我们</div>
              <div class="turn" style="color: #666">
                <div v-for="(item, index) in JSON.parse(setting.customerServiceConfig as string)" :key="index" style="display: flex; align-items: center;">
                  <span style="width: 80px">{{ item.label }}</span>
                  <a :href="item.url" target="_blank" style="margin-top: 0px">{{ item.name }}</a>
                </div>
              </div>
            </nav>
          </n-col>
        </n-row>
      </div>
    </div>
    <div style="border-top: var(--bomaos-border-color);">
      <div class="container">
        <div class="link-box">
          <div class="container beian">
            <n-space justify="center">
              <span>Copyright © 2024 波猫杂货铺</span>
              <n-divider vertical />
              <a class="beian-url">bomaos.com</a>
            </n-space>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;
</script>

<style scoped lang="less">
.bomaos-footer {
  border-top: 1px solid #f0f0f0;
  background-color: var(--bomaos-background-color);
}

.link-box {
  height: auto;
  .beian {
    text-align: center;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: .8rem;
    font-weight: 400;
    font-family: Content-font, Roboto, sans-serif;
    color: #222;
  }
}

.start-box {
  width: 100%;
  padding: 30px 0;
  background: var(--bomaos-background-color) url(https://www.apayun.com/static/images/apy/common/bg-footer.jpg) no-repeat center center;
  background-size: cover;
}

.auto-width {
  max-width: 1200px;
  margin: 0 auto;
}

.join-apy-wrap li {
  position: relative;
}

.join-apy-wrap li {
  display: flex;
  justify-content: center;
}

.join-apy-wrap svg {
  margin-right: 15px;
  width: 34px;
  height: 34px;
}

.font-weight-bold {
  font-weight: 900;
}

.font-size-24 {
  font-size: 24px;
}

.color-main-596680 {
  color: #979ead;
}

.join-apy-wrap li p {
  font-size: 16px;
  margin-top: 10px;
}

.join-apy-wrap .box-sizing-show:after {
  position: absolute;
  content: '';
  right: -10px;
  display: block;
  width: 1px;
  height: 55px;
  background-color: #e5e5e5;
}

.join-apy-wrap svg  {
  fill: var(--bomaos-color-primary);
}

.beian-url {
  color: #222;
}

.beian-url:hover {
  color: var(--bomaos-color-primary);
}

.bomaos-tools-widget {
  border-top: var(--bomaos-border-color);
  background-color: var(--bomaos-background-color);
  padding: 30px 0;
}

nav .title {
  color: #222;
  font-size: 1.125rem;
}

nav .turn {
  margin-top: 15px;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  div, a {
    margin-top: 8px;
    &:first-child {
      margin-top: 0px;
    }
  }
}

nav .turn a {
  font-size: 1rem;
  color: #666;
  display: block;

  &:hover {
    color: var(--bomaos-color-primary);
  }
}

.icon_links {
  display: flex;
  margin-top: 20px;
}

.icon_links a {
  margin-right: 20px;
}

nav .turn .follow {
  cursor: pointer;
}

nav .turn svg {
  padding: 5px;
  background-color: #7e7e7e;
  border-radius: 50%;
}

.qr-img {
  margin-top: 5px;
  width: 100px;
  height: 100px;
}
</style>