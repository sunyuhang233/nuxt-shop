<script setup lang="ts">
import {ref} from 'vue';
import {messageLoading} from "~/utils/message-loading";
import type {EmailParam, LoginParam} from "~/api/member/member/model";
import {login, sendEmailCode} from "~/api/member/member";
import {useMemberStore} from "~/store/useMemberStore";
import {goHomeRoute} from "~/utils/page-util";
import type {FormInst, FormItemRule} from "naive-ui";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;

const memberStore = useMemberStore();
const { currentRoute } = useRouter();

//
const formRef = ref<FormInst | null>(null)

// 加载状态
const loading = ref(false);

// 表单数据
const {form, resetFields} = useFormData<LoginParam>({
  email: '',
  code: '',
  remember: true
});

const rules = reactive({
  email: {
    required: true,
    trigger: ['input'],
    message: '请正确输入您的邮箱号',
    validator: (rule: FormItemRule, value: string) => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    }
  },
  code: {
    required: true,
    trigger: ['input'],
    message: '请输入4为数字验证码'
  }
})

// 发送验证码按钮loading
const codeLoading = ref(false);

// 验证码倒计时时间
const countdownTime = ref(0);

// 验证码倒计时定时器
let countdownTimer: number | null = null;

const emailParam = ref<EmailParam>({
  sendType: 'login',
  email: undefined
})

/* 发送短信验证码 */
const sendCode = () => {
  if (!form.email) {
    message.error('请输入邮箱号码')
    return;
  }
  emailParam.value.email = form.email;
  codeLoading.value = true;
  const hide = messageLoading('验证码发送中...', 0);
  sendEmailCode(emailParam.value).then(() => {
    hide();
    message.success('验证码发送成功、请注意查收!')
    countdownTime.value = 30;
    // 开始对按钮进行倒计时
    countdownTimer = window.setInterval(() => {
      if (countdownTime.value <= 1) {
        countdownTimer && clearInterval(countdownTimer);
        countdownTimer = null;
        codeLoading.value = false;
      }
      countdownTime.value--;
    }, 1000);
  }).catch((error) => {
    hide();
    message.error(error.message)
    codeLoading.value = false;
  })
};

onBeforeUnmount(() => {
  countdownTimer && clearInterval(countdownTimer);
});

/* 提交 */
const submit = () => {
  loading.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      const hide = messageLoading('正在登录中...', 0);
      login(form)
          .then((msg) => {
            memberStore.fetchMemberInfo().finally(() => {
              hide();
              message.success(msg);
              loading.value = false;
              goHome();
            })
          })
          .catch((e) => {
            hide();
            loading.value = false;
            message.error(e.message)
          });
    } else {
      loading.value = false;
    }
  });
};

/* 跳转到首页 */
const goHome = () => {
  const {query} = unref(currentRoute);
  goHomeRoute(query.from as string);
};

useHead({
  title: '登陆或注册 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div class="container">
    <div style="margin: 15px 0;">
      <div class="bomaos-main bomaos-login">
        <van-image
            width="600"
            height="410"
            fit="cover"
            :radius="5"
            style="border-radius: 5px 0 0 5px;"
            :preview-disabled="true"
            src="/assets/images/login_banner.jpg"
        >
          <div class="muya-row-wrapper">
            <div class="muya-light-col-wrapper">
              <img
                  class="muya-light-img-loaded"
                  style="height: 38px; border-radius: 50%"
                  src="~/assets/images/logo.svg"
              >
              <span style="color: white; font-size: 25px; margin-left: 15px">{{ setting.websiteName }}</span>
            </div>
            <span class="sc-himrzO gkijTG"></span>
            <span class="Text-jBunZU bMArXd lr-modal__logo__text" font-size="s5" color="inverse">注册 / 登录</span>
          </div>
        </van-image>
        <div class="bomaos-login-group">
          <div class="logo">
            <div class="bomaos-logo" style="letter-spacing: 0.2px;">
              <span>{{ setting.websiteName }}</span>
            </div>
          </div>
          <n-divider style="margin-top: 20px;">注册或登陆</n-divider>
          <div class="loginForm">
            <n-form
                ref="formRef"
                :label-width="80"
                :model="form"
                :rules="rules"
                size="large"
            >
              <n-form-item label="邮箱号" path="email">
                <n-input v-model:value="form.email as string" size="large" placeholder="请输入邮箱号">
                  <template #prefix>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 4.99L4 6zm0 12H4V8l8 5l8-5z"></path></svg>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item label="验证码" path="code">
                <div class="login-input-group">
                  <n-input v-model:value="form.code as string" size="large" placeholder="请输入验证码">
                    <template #prefix>
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110l312 110z"></path><path fill="currentColor" d="M378.4 475.1a35.91 35.91 0 0 0-50.9 0a35.91 35.91 0 0 0 0 50.9l129.4 129.4l2.1 2.1a33.98 33.98 0 0 0 48.1 0L730.6 434a33.98 33.98 0 0 0 0-48.1l-2.8-2.8a33.98 33.98 0 0 0-48.1 0L483 579.7z"></path></svg>
                    </template>
                  </n-input>
                  <n-button class="login-captcha" :disabled="!!countdownTime" @click="sendCode">
                    <span v-if="!countdownTime">获取验证码</span>
                    <span v-else>已发送 {{ countdownTime }} s</span>
                  </n-button>
                </div>
              </n-form-item>
              <n-button
                  strong
                  secondary
                  size="large"
                  type="primary"
                  style="width: 100%;"
                  :loading="loading"
                  @click="submit"
              >
                注册 / 登录
              </n-button>
            </n-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.bomaos-login {
  margin: 80px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-color: var(--bomaos-background-color);
  border-radius: 5px;
}

.bomaos-login-group {
  width: 280px;
  padding: 30px 40px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;

  .logo {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;

    .bomaos-logo {
      position: relative;
      font-weight: 700;
      line-height: 39px;
      overflow: hidden;
      margin: 0;
    }

    .bomaos-logo {
      height: 100%;
      font-size: 25px;
      font-weight: bold;
      color: #131313;
      display: flex;
      align-items: center;

      span, img {
        vertical-align: middle;
      }
    }
  }

  .loginForm {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
}

.login-form h4 {
  text-align: center;
  margin: 0 0 25px 0;
  font-size: 20px;
}

.muya-row-wrapper {
  position: absolute;
  left: 30px;
  top: 30px;
  display: flex;
  flex-flow: row wrap;
  box-sizing: border-box;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;

  .muya-light-col-wrapper {
    position: relative;
    flex: 0 0 auto;
    box-sizing: border-box;
    min-height: 1px;
    display: flex;
    align-items: center;
  }

  .gkijTG {
    display: inline-block;
    border-left: 1px solid rgb(255, 255, 255);
    height: 20px;
    margin: 0px 23px;
  }

  .bMArXd {
    color: rgb(255, 255, 255);
    font-size: 20px;
    line-height: 28px;
    box-sizing: border-box;
    margin: 0px;
  }
}

/* 验证码 */
.login-input-group {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  flex-direction: row;

  :deep(.ant-input-affix-wrapper) {
    flex: 1;
  }

  .login-captcha {
    height: 40px;
    padding: 0 10px;

    & > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>