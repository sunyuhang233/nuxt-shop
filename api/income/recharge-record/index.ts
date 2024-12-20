import type {PaymentResult, RechargeParam, RechargeRecord, RechargeRecordParam} from "./model";
import {hash} from "ohash";
import type {PageResult} from "~/api";
import useFetchRequest from "~/composables/useFetchRequest";

/**
 * 分页查询订单
 */
export async function pageRechargeRecords(params: RechargeRecordParam) {
    const res = await useFetchRequest.get<PageResult<RechargeRecord>>(
        '/income/recharge-record/page',
        { ...params }
    );
    if (res.code === 0) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}

/**
 * 创建订单
 * @param param 提交的字段
 */
export async function createRechargeRecord(param: RechargeParam) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(param) + '/income/recharge-record/create');
    const res = await request.post<PaymentResult>('/income/recharge-record/create', { ...param }, { server: false, key: key, watch: false });
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}