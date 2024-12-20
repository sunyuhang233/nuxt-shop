<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;

const { info } = storeToRefs(useMemberStore());

useHead({
  title: '我的会员 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div style="min-height: calc(100vh - 432px)">
    <n-row :gutter="[15, 15]">
      <n-col :span="24">
        <n-card :bordered="false" :content-style="{padding: '0px'}">
          <desktop-user-join-agent-my-agent/>
        </n-card>
      </n-col>
      <n-col :span="24">
        <n-card :bordered="false" :content-style="{padding: '0px'}">
          <desktop-user-join-agent-open-minded/>
        </n-card>
      </n-col>
    </n-row>
    <h2 class="member-rights-title text-vip">
      <span></span><span></span>
      <div class="mx-3">会员权益</div>
      <span></span><span></span>
    </h2>
    <n-row :gutter="[15, 15]">
      <n-col :span="8">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <div class="item-body">
            <h3 class="item-title">优先新品</h3>
            <div class="text-muted">新品资讯先知道</div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <div class="item-body">
            <h3 class="item-title">特惠价格</h3>
            <div class="text-muted">特殊折扣独享</div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <div class="item-body">
            <h3 class="item-title">营销支持</h3>
            <div class="text-muted">推广工具支持</div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <div class="item-body">
            <h3 class="item-title">产品培训</h3>
            <div class="text-muted">快速学习掌握</div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <div class="item-body">
            <h3 class="item-title">专属客服</h3>
            <div class="text-muted">专人服务响应</div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="8">
        <n-card :bordered="false" :content-style="{padding: '20px'}">
          <div class="item-body">
            <h3 class="item-title">区域保护</h3>
            <div class="text-muted">独占市场优势</div>
          </div>
        </n-card>
      </n-col>
    </n-row>
  </div>
</template>

<style scoped lang="less">
.member-rights-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;

  span {
    display: block;
    width: 6px;
    height: 18px;
    background-color: var(--bomaos-color-primary);
    border-radius: 10px;
    margin: 0 8px;
    transform: rotate(45deg);
    opacity: .8;
  }

  .mx-3 {
    margin-right: 1rem;
    margin-left: 1rem;
  }
}

.text-vip {
  color: var(--bomaos-color-primary);
}

.item-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  .text-muted {
    color: #666666;
    margin-top: 0.25rem!important;
  }
}
</style>