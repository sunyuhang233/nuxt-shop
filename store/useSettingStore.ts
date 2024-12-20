/**
 * 登录用户 store
 */
import {defineStore} from 'pinia';
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {getStoreSetting} from "~/api/settings/store-setting";

export interface SettingState {
  setting: StoreSetting | null;
  isDialog: boolean;
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => ({
    // 当前登录用户的信息
    setting: null,
    isDialog: false
  }),
  getters: {
    settingInfo(state) {
      return state.setting;
    },
  },
  actions: {
    /**
     * 请求用户信息、权限
     */
    async fetchSettingInfo() {
      await useAsyncData("read_setting", async () => getStoreSetting()).then((d) => {
        this.setting = d.data.value as StoreSetting;
      })
    },
    /**
     * 更新弹窗状态
     */
    setDialog(value: boolean) {
      this.isDialog = value;
    },
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'strict', // 保留其他选项
    }),
  },
});
