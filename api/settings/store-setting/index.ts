import type {StoreSetting} from "./model";

/**
 * 查询设置
 */
export async function getStoreSetting() {
  const res = await request.get<StoreSetting>('/settings/store-setting', null, {server: true});
  if (res.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.message));
}