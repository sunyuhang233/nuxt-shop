<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {useMessage} from "naive-ui";
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;

const message = useMessage();

const { info } = storeToRefs(useMemberStore());
const requestURL = useRequestURL();

/**
 * 复制推广链接
 */
const onCopySidUrl = (value: string) => {
  navigator.clipboard.writeText(value.toLocaleString())
      .then(() => {
        console.log('复制成功', value);
        message.success('复制成功')
      })
      .catch(err => {
        console.error('复制失败', err);
        message.error('复制失败')
      });
}

/* 划转佣金到余额 */
const showTransfer = ref(false);
const submitTransfer = () => {
  showTransfer.value = true;
}

/* 佣金提现 */
const showWithdrawal = ref(false);
const submitWithdrawal = ()  => {
  showWithdrawal.value = true;
}

useHead({
  title: '邀请返利 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div>
    <n-row gutter="15">
      <n-col :span="13">
        <n-card :bordered="false">
          <div class="bomaos-spread">
            <div class="left">
              每单{{ info?.rebatePercentage }}%返现随时提现
              <div class="desc">有渠道可联系站长提升佣金比例哦</div>
              <div class="url-wrapper" @click="onCopySidUrl(requestURL.origin + '?sid=' + info?.sid)">{{requestURL.origin + '?sid=' + info?.sid}}</div>
            </div>
            <div style="background-color: white; border: 1px solid rgb(0 0 0 / 9%); border-radius: 8px">
              <n-qr-code :value="requestURL.origin + '?sid=' + info?.sid" :size="90" :padding="10"/>
            </div>
          </div>
        </n-card>
      </n-col>
      <n-col :span="11">
        <n-card :bordered="false">
          <n-row gutter="15">
            <n-col :span="12">
              <div class="user-sidebar-count">
                <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none">
                  <path d="M312.543296 325.591473c14.818497 8.804527 33.983999 3.955078 42.814108-10.868535 33.795711-56.784284 92.344175-90.626044 156.723438-90.626044 0.213871 0 0.426719 0 0.64059 0 64.673975 0.224104 123.06485 34.177404 156.204621 90.823542 5.810333 9.933233 16.252149 15.46932 26.988678 15.46932 5.352915 0 10.782577-1.37737 15.738449-4.28049 14.890128-8.708336 19.902282-27.838022 11.18883-42.72815-44.415582-75.934436-122.886795-121.448026-209.907731-121.752971-0.289596 0-0.568958 0-0.864694 0-86.609567 0-165.217902 45.239344-210.395848 121.148198C292.854884 297.600979 297.719682 316.76648 312.543296 325.591473z" p-id="1907"></path>
                  <path d="M830.997288 344.93503c-0.37146 0-42.315758 1.189082-57.226353 4.51892l-17.339924 3.944845c-55.289234 12.658298-169.981393 38.910195-251.04464 38.910195-0.483001 0-0.966001-0.005117-1.449002-0.005117-93.243661-0.37146-230.755548-35.265178-270.65221-45.945425-8.367575-2.24718-23.648606-3.365654-32.397874-3.853771-1.01205-0.051165-3.578502-0.101307-5.510504-0.051165l-1.174756 0c-0.218988 0-0.436952 0-0.655939 0-41.126676 0-75.049277 15.164375-98.134041 43.881416-20.090571 24.991184-30.770817 59.107189-30.893614 98.642624-0.091074 27.90863 7.163143 55.05592 20.939915 78.420047l131.330094 224.198202c0.381693 0.661056 0.787946 1.296529 1.214664 1.916653 23.369244 44.593638 66.621327 72.258721 113.995287 72.522734l355.823008 0.976234c50.785663 0 91.876524-25.027 116.252701-70.616314 0.584308-0.803295 1.13894-1.63729 1.657756-2.506077l132.667555-223.049029c13.970176-23.333428 21.397333-50.414203 21.48329-78.308507C960.146717 401.61289 909.605623 345.245092 830.997288 344.93503zM884.787378 534.777773c-0.01535 0.025583-0.030699 0.056282-0.046049 0.080841l-130.262786 218.99776c-1.529843 1.845021-2.867304 3.89368-3.970428 6.120394-13.304004 26.91807-34.395368 40.566928-62.599733 40.566928l-355.650069-0.976234c-24.746614-0.137123-47.791469-16.023952-60.139705-41.462321-0.960885-1.982144-2.12029-3.828188-3.441379-5.51562L139.313929 531.75288c-8.118911-13.776771-12.384052-29.876448-12.32777-46.575782 0.076748-25.224498 5.993504-45.8697 17.111726-59.70173 11.118222-13.827937 27.288506-20.553105 49.402153-20.553105 0.14224 0 0.284479 0 0.426719 0l3.853771-0.030699c6.964622 0.391926 16.86204 1.281179 19.323091 1.805112 41.762149 11.178597 185.836499 47.673789 286.589181 48.075949 88.500637 0.554632 204.346061-26.210965 266.671549-40.48097l16.994046-3.864004c6.176676-1.286296 33.867342-2.740414 43.516096-3.024893 58.105373 0.229221 66.63156 50.811246 66.539462 80.936357C897.363811 505.012865 892.997364 521.072633 884.787378 534.777773z" p-id="1908"></path>
                  <path d="M397.273049 498.892471c-17.248849 0-31.233352 13.985526-31.233352 31.233352l0 28.732391c0 17.248849 13.985526 31.233352 31.233352 31.233352s31.233352-13.985526 31.233352-31.233352L428.506401 530.126846C428.506401 512.877997 414.521898 498.892471 397.273049 498.892471z" p-id="1909"></path>
                  <path d="M627.12911 498.892471c-17.248849 0-31.233352 13.985526-31.233352 31.233352l0 28.732391c0 17.248849 13.985526 31.233352 31.233352 31.233352s31.233352-13.985526 31.233352-31.233352L658.362462 530.126846C658.362462 512.877997 644.37796 498.892471 627.12911 498.892471z" p-id="1910"></path>
                  <path d="M585.822332 632.601752c-14.259772-9.400091-33.552164-5.429663-43.159986 8.703219-0.121773 0.178055-12.343119 17.848507-30.750351 17.848507-17.833157 0-29.083385-16.272615-29.886681-17.46272-9.18622-14.417361-28.264741-18.794042-42.819225-9.734712-14.650675 9.099239-19.145036 28.361955-10.039657 43.012629 10.767228 17.324574 40.313148 46.65253 82.746586 46.65253 42.219567 0 72.121598-29.098735 83.137489-46.291302C604.260264 660.94324 600.082104 642.012076 585.822332 632.601752z" p-id="1911"></path>
                </svg>
                <p class="user-item-count">{{ info?.totalRebateOrdersCount }}</p>
                <div class="user-item-name">订单总数</div>
              </div>
              <n-button type="primary" size="large"  strong secondary style="width: 100%;" @click="submitTransfer">
                佣金转余额
              </n-button>
            </n-col>
            <n-col :span="12">
              <div class="user-sidebar-count" style="cursor: pointer;">
                <p class="user-item-count">
                  <n-number-animation :from="0.00" :to="info?.rebateAmount" :active="true" :precision="2"/>
                </p>
                <div class="user-item-name">佣金总数</div>
              </div>
              <n-button type="info" size="large" strong secondary style="width: 100%;" @click="submitWithdrawal">
                提现佣金
              </n-button>
            </n-col>
          </n-row>
        </n-card>
      </n-col>
    </n-row>
    <n-card :bordered="false" content-style="padding: 0;" style="margin-top: 15px">
      <n-tabs
          type="line"
          size="large"
          :bar-width="20"
          :tabs-padding="20"
          animated
          :pane-style="{ padding: '20px', width: 'auto' }"
      >
        <n-tab-pane name="1" tab="订单统计">
          <!-- 订单统计 -->
          <desktop-user-spread-record-orders />
        </n-tab-pane>
        <n-tab-pane name="3" tab="提现记录">
          <!-- 提现记录 -->
          <desktop-user-spread-record-withdraw />
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <desktop-user-spread-transfer v-model:visible="showTransfer" />
    <desktop-user-spread-withdraw v-model:visible="showWithdrawal" />
  </div>
</template>

<style scoped lang="less">
:deep(.n-card > .n-card__content) {
  padding: 20px;
}

.user-sidebar-count {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.user-sidebar-count {
  width: 100%;
  padding: 5px 20px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #edf1f4;
  -webkit-transition: all .2s linear;
  transition: all .2s linear;
}

.user-sidebar-count .withdraw {
  cursor: pointer;
  background: rgb(26 137 250);
  color: #ffffff;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 0 10px 0 5px;
  z-index: 1;
}

.user-sidebar-count svg {
  position: absolute;
  width: 80px;
  height: 80px;
  fill: #1a89fa17;
  right: 5px;
  top: 5px;
}

.user-sidebar-count > div {
  position: relative;
  color: #b1b1b1;
  font-size: 13px;
  margin-top: 1px;
}

.user-sidebar-count p {
  line-height: 1.2;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0px;
}

.bomaos-record :deep(.n-tabs .n-tabs-nav-scroll-content) {
  border-bottom: 1px solid #f3f4f4;
  padding: 5px 0;
}

:deep(.n-tabs .n-tabs-bar) {
  height: 4px;
  bottom: 8px;
  border-radius: 4px;
}

.bomaos-record :deep(.n-tabs .n-tabs-nav .n-tabs-nav__suffix) {
  border-bottom: 1px solid #f3f4f4;
  padding-right: 20px;
  font-size: 18px;
}

.bomaos-record :deep(.n-tabs .n-tab-pane) {
  padding: 20px;
}

.left {
  font-weight: 600;
  font-size: 18px;
  height: 111px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.left .desc {
  font-weight: 400;
  font-size: 12px;
  color: #1a89fa;
  padding: 0 0 0.21333rem;
}

.left .url-wrapper {
  font-weight: 400;
  padding: 3px 8px;
  background-color: #edf1f4;
  font-size: 12px;
  border-radius: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.bomaos-spread {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>