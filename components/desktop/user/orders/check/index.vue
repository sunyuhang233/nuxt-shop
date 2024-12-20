<script setup lang="ts">
import type {OrdersDto} from "~/api/income/orders/model";
import {useMessage} from 'naive-ui';
import {downloadTxtFile} from '~/utils/common-util';

const message = useMessage();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  data: OrdersDto;
}>();

const onCopyCardKey = (value: string) => {
  navigator.clipboard.writeText(value.toLocaleString())
      .then(() => {
        console.log('复制成功', value);
        message.success('复制成功')
      })
      .catch(err => {
        console.error('复制失败', err);
        message.success('复制失败')
      });
}

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};
</script>

<template>
  <n-drawer
      :show="visible"
      :default-width="400"
      placement="right"
      resizable
      mask-closable
      :block-scroll="false"
      @update-show="updateVisible(false)"
  >
    <n-drawer-content
        closable
        :body-content-style="{padding: '20px'}"
    >
      <template #header>
        <n-ellipsis :line-clamp="1" :tooltip="false">
          {{ '查看卡密【' + data.productName + '】' }}
        </n-ellipsis>
      </template>
      <n-input
          v-model:value="data.cardSecretInfo"
          type="textarea"
          :rows="12"
      />
      <div class="bomaos-row">
        <n-button
            strong
            secondary
            type="primary"
            block
            style="flex-shrink: inherit;"
            @click="onCopyCardKey(data.cardSecretInfo as string)"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z"/></svg>
          </template>
          复制卡密
        </n-button>
        <n-button
            strong
            secondary
            style="flex-shrink: inherit"
            type="warning"
            @click="downloadTxtFile(data.cardSecretInfo as string, data.productName + '.txt')"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.575q-.2 0-.375-.062T11.3 15.3l-3.6-3.6q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L11 12.15V5q0-.425.288-.712T12 4q.425 0 .713.288T13 5v7.15l1.875-1.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-3.6 3.6q-.15.15-.325.213t-.375.062M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15q.425 0 .713.288T6 16v2h12v-2q0-.425.288-.712T19 15q.425 0 .713.288T20 16v2q0 .825-.587 1.413T18 20z"/></svg>
          </template>
          下载卡密
        </n-button>
      </div>
      <n-divider>
        详细阅读如下使用说明
      </n-divider>
      <n-scrollbar style="max-height: calc(100vh - 500px)">
        <common-view-md :content="data.instructions as string" />
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped lang="less">
.bomaos-row {
  margin-top: 15px;
  display: inline-flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}
</style>