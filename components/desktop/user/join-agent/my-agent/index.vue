<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {getAgentPackage} from "~/api/marketing/agent-package";
import type {AgentPackage} from "~/api/marketing/agent-package/model";

const { info } = storeToRefs(useMemberStore());

const agentPackage = ref<AgentPackage>({});
await useAsyncData("read_agent_pagkage", async () => getAgentPackage(info.value?.agentPackageId)).then((d) => {
  agentPackage.value = d.data.value as AgentPackage;
})
</script>

<template>
  <div class="boniu-card" style="padding: 20px">
    <div class="package">
      <div class="avatar">
        <n-avatar
            round
            :size="48"
            :src="info?.avatar ? info.avatar : '/assets/images/avatar.png'"
        />
      </div>
      <div class="header-body">
        <div class="title">
          <span v-if="agentPackage" style="font-weight: bold; margin-right: 10px">{{ agentPackage.packageName }}</span>
          <span v-else style="font-weight: bold; margin-right: 10px">您还未开通任何会员</span>
          <n-tag v-if="agentPackage" type="warning" size="small">
            大会员
          </n-tag>
        </div>
        <div class="end">
          <span style="margin-right: 5px">剩余时间: </span>
          <van-count-down
              v-if="agentPackage"
              style="color: #7e7e7e;"
              :time="(new Date(info?.agentExpireDate as string).getTime()) - (new Date().getTime())"
              format="DD 天 HH 时"
          />
          <span v-else>请先开通会员</span>
        </div>
      </div>
    </div>
    <n-divider style="margin: 20px 0"/>
    <div style="text-align: center;">
      您已开通会员，可享受特价优惠，提升利润。获取新品先机，专享营销支持，市场独家权益。
    </div>
  </div>
</template>

<style scoped lang="less">
.package {
  display: flex;
  align-items: center;

  .avatar {
    display: inherit;
  }

  .header-body {
    margin-left: 15px;

    .title {
      font-size: 17px;
      display: flex;
      align-items: center;
    }

    .end {
      font-size: 14px;
      color: #7e7e7e;
      margin-top: 5px;
      display: flex;
      align-items: center;
    }
  }
}
</style>