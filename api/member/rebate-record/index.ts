import type {RebateRecord, RebateRecordParam} from "./model";
import useFetchRequest from "~/composables/useFetchRequest";
import type {PageResult} from "~/api";

/**
 * 分页查询订单
 */
export async function pageRebateRecords(params: RebateRecordParam) {
    const res = await useFetchRequest.get<PageResult<RebateRecord>>('/member/rebate-record/page', { ...params });
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}