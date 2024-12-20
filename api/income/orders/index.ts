import type {CreateOrdersParam, OrderParam, OrdersDto, PaymentResult} from "~/api/income/orders/model";
import {hash} from "ohash";
import type {PageResult} from "~/api";

/**
 * 分页查询订单
 */
export async function pageOrders(params: OrderParam) {
    const res = await request.get<PageResult<OrdersDto>>('/income/orders/page', { ...params }, {server: true});
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}

/**
 * 创建订单
 * @param param 提交的字段
 */
export async function createOrder(param: CreateOrdersParam) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(param) + '/income/orders/create');
    const res = await request.post<PaymentResult>('/income/orders/create', { ...param }, { server: false, key: key, watch: false });
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}

/**
 * 催促订单
 * @param param 提交的字段
 */
export async function remindOrder(orderId?: number) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(orderId) + '/income/orders/remind');
    const res = await request.get<unknown>('/income/orders/remind/' + orderId, null, { server: false, key: key, watch: false });
    if (res.code === 0) {
        return res.message;
    }
    return Promise.reject(new Error(res.message));
}

/**
 * 检测订单
 * @param param 提交的字段
 */
export async function checkOrder(orderId?: number) {
    /**
     * 修复未知字段提交后，输入框再次输入后，未点击提交按钮，自动提交问题
     */
    const key = hash(JSON.stringify(orderId) + '/income/orders/check');
    const res = await request.get<unknown>('/income/orders/check/' + orderId, null, { server: false, key: key, watch: false });
    if (res.code === 0) {
        return res.message;
    }
    return Promise.reject(new Error(res.message));
}