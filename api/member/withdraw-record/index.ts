import type {WithdrawRecord, WithdrawRecordParam} from "./model";
import {hash} from "ohash";
import request from "~/composables/request";
import useFetchRequest from "~/composables/useFetchRequest";
import type {PageResult} from "~/api";

/**
 * 分页查询订单
 */
export async function pageWithdrawRecords(params: WithdrawRecordParam) {
    const res = await useFetchRequest.get<PageResult<WithdrawRecord>>('/member/withdraw-record/page', { ...params }, {server: false});
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}

/**
 * 提现金额
 * @param params
 */
export async function createWithdraw(params: WithdrawRecordParam) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(params) + '/member/withdraw-record/createWithdraw');
    const res = await request.post<unknown>('/member/withdraw-record/createWithdraw', {...params}, { server: false, key: key, watch: false });
    if (res.code === 0) {
        return res.message;
    }
    return Promise.reject(new Error(res.message));
}