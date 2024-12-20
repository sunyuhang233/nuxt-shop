import request from "~/composables/request";
import type {TransferMoneyParam} from "~/api/member/spread/model";
import {hash} from "ohash";

/**
 * 划转佣金到余额
 * @param params
 */
export async function transferMoney(params: TransferMoneyParam) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(params) + '/member/withdraw-record/transferMoney');
    const res = await request.post<unknown>('/member/withdraw-record/transferMoney', {...params}, { server: false, key: key, watch: false });
    if (res.code === 0) {
        return res.message;
    }
    return Promise.reject(new Error(res.message));
}