<script setup lang="ts">
import {getNameAndColor} from "~/utils/common-util";
import type {OrdersDto} from "~/api/income/orders/model";
import {remindOrder} from "~/api/income/orders";

const emit = defineEmits<{
  (e: 'done', data: OrdersDto): void;
}>();

const props = defineProps<{
  data: OrdersDto;
}>();

/**
 * 手动发货中，催促发货
 */
const promptLoading = ref<boolean>(false);

// 开始前先开启加载
const starLoading = () => {
  promptLoading.value = true;
}

/**
 * 催促订单发货
 * @param value
 */
const onPrompt = (value?: number) => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '正在催促订单...',
  });
  remindOrder(value).then((d) => {
    closeToast();
    promptLoading.value = false;
    showNotify({ type: 'success', message: d });
  }).catch((error) => {
    closeToast();
    promptLoading.value = false;
    showNotify({ type: 'warning', message: error.message });
  })
}
</script>

<template>
  <n-card
      :bordered="false"
      :segmented="{
          content: true,
                footer: 'soft'
              }"
      :header-style="{padding: '0px', fontSize: 'inherit'}"
      :content-style="{padding: '15px'}"
  >
    <template #header>
      <div class="latest-activity-card__badge" :class="data.status == 2 ? 'error' : 'success'" v-if="[2, 3].includes(data.status as number) && data.shippingType == 1">
        {{ data.status == 2 ? '等待发货' : '发货成功' }}
      </div>
      <div class="bomaos-order-header">
        <n-image
            width="50"
            height="50"
            object-fit="cover"
            :src="data.coverImage"
            style="border-radius: 3px;"
        />
        <div class="title">
          <p class="g-name">
            <nuxt-link :to="'/product/' + data.uniqueLink" style="color: #222;">
              <n-ellipsis :line-clamp="1" :tooltip="false">
                {{ data.productName }}
              </n-ellipsis>
            </nuxt-link>
          </p>
          <div class="number" style="margin-top: 5px">
            <n-space :size="0" style="align-items: flex-end;">
              数量: x{{ data.number }} <span v-if="data.categoryName">, {{ data.categoryName }}</span>
            </n-space>
          </div>
          <div class="van-cell__label" style="margin-top: 5px">
            <n-space :size="0" style="align-items: flex-end;">
              <div class="action">
                <n-tag
                    size="small"
                    :bordered="false"
                    :type="data.shippingType === 0 ? 'info' : 'error'"
                >
                  {{ data.shippingType === 0 ? '自动发货' : '手动发货' }}
                </n-tag>
              </div>
              <n-divider vertical />
              <div class="action">
                {{ data.orderId }}
              </div>
            </n-space>
          </div>
        </div>
      </div>
    </template>
    <div class="bd">
      <dl style="position: relative; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1;">
        <dt>
          <span :style="{ color: data.status == 0 ? 'rgb(245, 108, 108)' : '#409EFF' }">{{ data.status == 0 ? '未支付' : '已付款' }}</span>
        </dt>
        <dd>支付状态</dd>
      </dl>
      <dl class="dd-box" style="position: relative; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1;">
        <dt>
          <span :style="{color: getNameAndColor(data.paymentType as string)?.color}">
            {{ getNameAndColor(data.paymentType as string)?.name }}
          </span>
        </dt>
        <dd>付款方式</dd>
      </dl>
      <dl class="dd-box" style="position: relative; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1;">
        <dt>{{ data.totalAmount.toFixed(2) }}</dt>
        <dd>订单金额</dd>
      </dl>
    </div>
    <template #action>
      <div class="bomaos-row">
        <n-button
            strong
            secondary
            type="primary"
            block
            style="flex-shrink: inherit;"
            :disabled="[0, 2].includes(data.status as number)"
            @click="emit('done', data);"
        >
          查看卡密
        </n-button>
        <n-button
            v-if="data.shippingType == 1 && data.status == 2"
            strong
            secondary
            style="flex-shrink: inherit"
            type="error"
            :loading="promptLoading"
            @click="starLoading"
            v-debounce="() => onPrompt(data.orderId as number)"
        >
          催促发货
        </n-button>
        <!--                  <n-button
                              v-if="[0].includes(item.status as number)"
                              round
                              strong
                              secondary
                              type="error"
                              style="flex-shrink: inherit;"
                              @click="openCheck(item)"
                          >
                            继续支付
                          </n-button>-->
      </div>
    </template>
  </n-card>
</template>

<style scoped lang="less">
.bomaos-order-header {
  display: flex;
  margin: 15px;

  .title {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .g-name {
      font-size: 15px;
      line-height: 1.2;
      font-weight: 400;
    }

    .number {
      font-size: 13px;
      color: #707070;
      font-weight: 400;
    }

    .van-cell__label {
      margin-top: 0px;
      color: #707070;
      font-size: 12px;
      line-height: 18px;

      .action {
        font-size: 13px;
        display: flex;
        align-items: center;
      }
    }
  }
}

.bd {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;

  dt {
    font-size: 15px;
    color: #666;
    font-family: Content-font, Roboto, sans-serif;
    font-weight: 600;
    margin-bottom: 5px;

    dd {
      font-size: 12px;
      color: #999;
    }
  }

  dd {
    color: #999;
  }

  .dd-box {
    &:after {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%; /* 将 top 设置为 50%，使元素移动到容器高度的一半 */
      width: 1px;
      height: 50%;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.1);
      transform-origin: 0 0;
      transform: translateY(-50%) scaleX(0.5); /* 向上移动元素自身高度的一半 */
    }
  }
}

:deep(.n-card__action) {
  padding: 15px !important;
}

.bomaos-row {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  width: 100%;

  .bomaos-col {
    display: block;
  }
}

.latest-activity-card__badge {
  position: absolute;
  right: -3.5px;
  top: -4px;
  height: 26px;
  border-radius: 0 5px 0 5px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  padding: 4px 10px;
  display: flex;
  align-items: center;
}

.latest-activity-card__badge:before {
  content: "";
  width: 14px;
  height: 26px;
  position: absolute;
  background-size: auto 100%;
  top: 0;
  left: -8px;
}

.latest-activity-card__badge.error {
  background: linear-gradient(to right, rgb(255 59 59) 0%, rgba(255, 103, 128, 0.88) 100%);
}

.latest-activity-card__badge.success {
  background: linear-gradient(to right, #409EFF 0%, rgba(0, 185, 107, 0.88) 100%);
}

.latest-activity-card__badge.error:before {
  background-image: url(/assets/images/user/badge-corner.svg);
}

.latest-activity-card__badge.success:before {
  background-image: url(/assets/images/user/badge-success.svg);
}
</style>