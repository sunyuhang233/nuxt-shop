<script setup lang="ts">
import {useMemberStore} from "~/store/useMemberStore";

const memberStore = useMemberStore();
memberStore.fetchMemberInfo();

const router = useRouter();
const route = useRoute();
const { info } = storeToRefs(useMemberStore());

/* star tab 类型 */
const active = ref<number>(0);

watchEffect(() => {
  switch (route.path) {
    case '/user/orders':
      active.value = 0;
      break;
    case '/user/wallet':
      active.value = 1;
      break;
    case '/user/join-agent':
      active.value = 2;
      break;
    case '/user/spread':
      active.value = 3;
      break;
    default:
      active.value = 0; // 默认选中第一个 tab
  }
});
</script>

<template>
  <div>
    <div class="mine-header">
      <div class="content">
        <div class="nact-selllist-icon"></div>
        <div class="author">
          <div class="main">
            <div style="width: 60px; height: 60px">
              <van-image
                  round
                  width="60px"
                  height="60px"
                  fit="cover"
                  style="border: 2px solid #ffffff"
                  :src="info?.avatar ? info.avatar : '/assets/images/avatar.png'"
              />
            </div>
            <div class="info">
              <div>
                <span>{{ info?.nickName }}</span>
              </div>
              <span class="user-id">{{ info?.introduction ?? '这家伙很懒、什么都不说' }}</span>
            </div>
          </div>
          <van-icon name="arrow" color="white" size="20"/>
        </div>
        <div class="statistical">
          <div class="bd">
            <dl style="position: relative; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1;">
              <dt>{{ info?.balance?.toFixed(2) }}</dt>
              <dd>钱包余额</dd>
            </dl>
            <dl class="dd-box" style="position: relative; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1;">
              <dt>{{ info?.totalOrdersCount }}</dt>
              <dd>订单数量</dd>
            </dl>
            <dl class="dd-box" style="position: relative; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1;">
              <dt>{{ info?.rebateAmount?.toFixed(2) }}</dt>
              <dd>我的佣金</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <van-tabs
        v-model:active="active"
        shrink
        border
        line-width="20px"
        title-active-color="var(--bomaos-color-primary)"
    >
      <van-tab title="我的订单" to="/user/orders"/>
      <van-tab title="我的钱包" to="/user/wallet"/>
      <van-tab title="我的会员" to="/user/join-agent"/>
      <van-tab title="邀请返利" to="/user/spread"/>
    </van-tabs>
    <NuxtPage />
  </div>
</template>

<style scoped lang="less">
.mine-header {
  background-color: white;
  box-shadow: 0 -4px 50px #291b4408;
  padding: 15px 0;

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    padding: 15px;
    margin: 0 15px;
    background-color: var(--bomaos-color-primary);

    .nact-selllist-icon {
      background-image: url(/assets/images/user/backer.png);
      position: absolute;
      width: 158px;
      height: 100px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      opacity: 0.3;
      z-index: 0;
      right: 0px;
      bottom: 0px;
    }

    .author {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px 0 10px;

      .main {
        display: flex;
        align-items: center;

        .info {
          margin-left: 15px;

          div {
            font-weight: bold;
            margin-bottom: 10px;
            span {
              color: white;
              font-size: 20px;
            }
          }

          .user-id {
            color: #f1f1f1;
            font-size: 13px;
            text-shadow: 0 1px 1px rgb(92 92 92 / 20%);
          }
        }
      }
    }

    .statistical {
      .bd {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;

        dt {
          font-size: 18px;
          color: #ffffff;
          font-weight: 600;
          margin-bottom: 5px;
        }

        dd {
          margin-inline-start: 0;
          font-size: 12px;
          color: #ffffff;
        }

        .dd-box:after {
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          bottom: 0;
          border-left: 1px solid rgb(0 0 0 / 21%);
          color: rgba(0, 0, 0, 0.1);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }
    }
  }
}

:deep(.van-tabs__nav) {
  justify-content: center;
}

:deep(.van-tab) {
  font-size: 17px;
}

:deep(.van-tabs__line) {
  background: var(--bomaos-color-primary);
}

:deep(.van-tabs__line) {
  bottom: 23px;
}

:deep(.van-tabs--line .van-tabs__wrap) {
  height: 55px;
}
</style>