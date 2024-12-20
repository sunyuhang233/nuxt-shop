import request from "~/composables/request";
import type {ClassifyDto} from './model';
import type {ProductParam} from "~/api/product/product/model";

/**
 * 查询商品列表
 */
export async function listClassifyDtos(params?: ProductParam) {
    const res = await request.get<ClassifyDto[]>('/product/classify/list', { ...params }, {server: true});
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}

