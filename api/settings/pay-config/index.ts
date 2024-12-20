import type {PayConfig, PayConfigParam} from "~/api/settings/pay-config/model";

/**
 * 查询支付列表
 */
export async function listPayConfigs(params?: PayConfigParam) {
    const res = await request.get<PayConfig[]>('/settings/pay-config', { ...params }, {server: true});
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}