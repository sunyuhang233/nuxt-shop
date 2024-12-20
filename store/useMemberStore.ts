/**
 * 登录用户 store
 */
import {defineStore} from 'pinia';
import type {Member} from "@/api/member/member/model";
import {getMemberInfo} from "@/api/member/member";

export interface MemberState {
  info: Member | null;
}

export const useMemberStore = defineStore('member', {
  state: (): MemberState => ({
    // 当前登录用户的信息
    info: null
  }),
  getters: {
    memberInfo(state) {
      return state.info;
    },
  },
  actions: {
    /**
     * 请求用户信息、权限
     */
    async fetchMemberInfo() {
      const result = await getMemberInfo().catch(() => {});
      if (!result) {
        return {};
      }
      // 用户信息
      this.info = result;
    },
    removeInfo() {
      this.info = null;
    }
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'strict',
    }),
  },
});
