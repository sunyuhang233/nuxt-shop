<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";
import {updateMemberInfo} from "~/api/member/member";
import type {Member} from "~/api/member/member/model";
import {uploadFile} from "~/api/file";
import {useDialog} from 'naive-ui'

const memberStore = useMemberStore();
memberStore.fetchMemberInfo();

const { info } = storeToRefs(useMemberStore());
const dialog = useDialog();

const form = reactive<Member>({
  avatar: info.value?.avatar,
})

/**
 * 上传头像
 * @param file
 */
const afterRead = ({ file, onFinish }) => {
  const hide = messageLoading('正在上传中...', 0);
  // 此时可以自行将文件上传至服务器
  uploadFile(file).then((res) => {
    hide();
    /**
     * 上传好返回的路径
     * 赋值给 avatar
     */
    form.avatar = res.url;

    /**
     * 更新用户头像
     */
    updateMemberInfo(form).then(() => {
      useMemberStore().fetchMemberInfo();
      message.success('头像修改完成')
      onFinish();
    })
  }).catch((error) => {
    hide();
    message.success(error.message)
  })
}

/**
 * 退出登陆
 */
const onLogout = () => {
  dialog.warning({
    title: '警告',
    content: '您确定要退出登陆吗？',
    positiveText: '确定',
    negativeText: '取消',
    style: {width: '350px'},
    blockScroll: false,
    transformOrigin: 'mouse',
    onPositiveClick: () => {
      logout(true);
    }
  })
}
</script>

<template>
  <div class="container">
    <div style="margin: 15px 0; min-height: calc(100vh - 432px)">
      <n-row gutter="15" style="display: block;">
        <n-col :span="7" class="sticky">
          <n-card
              :bordered="false"
              :segmented="{
                  content: true,
                  footer: 'soft'
                }"
              :content-style="{padding: 0}"
          >
            <div class="btn-img" style="margin-top: 30px">
              <n-badge value="普通用户" type="info" :offset="[-50, 92]">
                <div class="van-circle" style="width: 100px; height: 100px;">
                  <svg viewBox="0 0 1020 1020">
                    <defs>
                      <linearGradient id="van-circle-1" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FF3356E0"></stop>
                        <stop offset="100%" stop-color="#FF6780E0"></stop>
                      </linearGradient>
                    </defs>
                    <path class="van-circle__layer" d="M 510 510 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000" style="fill: none; stroke-width: 20px;"></path>
                    <path d="M 510 510 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000" class="van-circle__hover" stroke="url(#van-circle-1)" style="stroke: url(&quot;#van-circle-1&quot;); stroke-width: 21px; stroke-dasharray: 3140px, 3140px;"></path>
                  </svg>
                  <div class="btn-img-border">
                    <n-upload :show-file-list="false" :custom-request="afterRead">
                      <n-avatar
                          round
                          :size="88"
                          object-fit="cover"
                          :src="info?.avatar ?? '/assets/images/avatar.png'"
                      />
                      <upload-outlined />
                    </n-upload>
                  </div>
                </div>
              </n-badge>
            </div>
            <div style="margin-top: 20px; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
              <p style="font-weight: bold">{{ info?.nickName }}</p>
              <p style="color: #666">{{ info?.email }}</p>
            </div>
            <n-divider style="margin-bottom: 0px"/>
            <nuxt-link class="nav-item" to="/user/orders" active-class="active">
              <div class="cover">
                <n-image
                    :height="25"
                    :width="25"
                    object-fit="cover"
                    src="/assets/images/user/orders.svg"
                />
              </div>
              <div class="nav-cell__title">
                <div :style="{ fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center'}">
                  <n-ellipsis :line-clamp="1" :tooltip="false">
                    我的订单
                  </n-ellipsis>
                </div>
                <div>
                  <van-icon name="arrow" />
                </div>
              </div>
            </nuxt-link>
            <nuxt-link class="nav-item" to="/user/wallet" active-class="active">
              <div class="cover">
                <n-image
                    :height="25"
                    :width="25"
                    object-fit="cover"
                    src="/assets/images/user/wallet.svg"
                />
              </div>
              <div class="nav-cell__title">
                <div :style="{ fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center'}">
                  <n-ellipsis :line-clamp="1" :tooltip="false">
                    我的钱包
                  </n-ellipsis>
                </div>
                <div>
                  <van-icon name="arrow" />
                </div>
              </div>
            </nuxt-link>
            <nuxt-link class="nav-item" to="/user/join-agent" active-class="active">
              <div class="cover">
                <n-image
                    :height="25"
                    :width="25"
                    object-fit="cover"
                    src="/assets/images/user/agent.svg"
                />
              </div>
              <div class="nav-cell__title">
                <div :style="{ fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center'}">
                  <n-ellipsis :line-clamp="1" :tooltip="false">
                    我的会员
                  </n-ellipsis>
                </div>
                <div>
                  <van-icon name="arrow" />
                </div>
              </div>
            </nuxt-link>
            <nuxt-link class="nav-item" to="/user/spread" active-class="active">
              <div class="cover">
                <n-image
                    :height="25"
                    :width="25"
                    object-fit="cover"
                    src="/assets/images/user/spread.svg"
                />
              </div>
              <div class="nav-cell__title">
                <div :style="{ fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center'}">
                  <n-ellipsis :line-clamp="1" :tooltip="false">
                    邀请返利
                  </n-ellipsis>
                </div>
                <div>
                  <n-tag type="warning" size="small">
                    赚钱
                  </n-tag>
                </div>
              </div>
            </nuxt-link>
            <template #action>
              <div style="width: auto;">
                <n-button strong secondary type="error" block size="large" @click="onLogout">
                  退出登录
                </n-button>
              </div>
            </template>
          </n-card>
        </n-col>
        <n-col :span="17">
          <NuxtPage />
        </n-col>
      </n-row>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 快捷导航 */
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px 20px;
  color: var(--bomaos-color-dark);
  border-bottom: var(--bomaos-border-color);

  &:nth-last-child(1) {
    border-bottom: 0px solid transparent;
  }

  &:hover {
    background-color: #f5f5f561;
  }

  &.active {
    background-color: #f5f5f561;
    color: var(--bomaos-color-primary); /* 激活项的样式 */

    &:before {
      transition: top 0.3s ease-in-out;
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 30%;
      border-inline-start: 3px solid var(--bomaos-color-primary);
      border-radius: 999px;
      content: " ";
    }
  }

  &.disabled {
    pointer-events: none; /* 禁止点击 */
  }

  .cover {
    width: 25px;
    display: flex;
    align-items: center;
  }

  .nav-cell__title {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

.btn-img {
  position: relative;
  height: auto;
  display: flex;
  justify-content: center;
}

.btn-img-border {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background-size: cover;

  .user-img {
    width: 116px;
    height: 116px;
  }

  .user-img {
    border-radius: 50%;
  }
}

svg:not(:root) {
  overflow: hidden;
}

.btn-img-border :deep(.n-upload .n-upload-trigger > .anticon svg) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  height: 30px;
  width: 30px;
  display: none;
  z-index: 2;
}

.btn-img-border :deep(.n-upload .n-upload-trigger:hover > .anticon svg) {
  display: block;
}

.btn-img-border :deep(.n-upload .n-upload-trigger:hover:after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.van-circle {
  display: inline-block;
  height: 100px;
  position: relative;
  text-align: center;
  width: 100px;
  svg {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}

.van-circle__layer {
  stroke: #fff;
}

.van-circle__hover {
  fill: none;
  stroke: #1989fa;
  stroke-linecap: round;
}

:deep(.n-tabs .n-tabs-bar) {
  height: 4px;
  bottom: 8px!important;
  border-radius: 4px!important;
}
</style>