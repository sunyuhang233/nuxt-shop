import type {AgentOrders} from "~/api/income/agent-orders/model";
import {hash} from "ohash";
import type {PaymentResult} from "~/api/income/orders/model";

/**
 * 创建订单
 * @param param 提交的字段
 */
export async function createAgentOrder(param: AgentOrders) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(param) + '/income/agent-orders/create');
    const res = await request.post<PaymentResult>('/income/agent-orders/create', { ...param }, { server: false, key: key, watch: false });
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}
