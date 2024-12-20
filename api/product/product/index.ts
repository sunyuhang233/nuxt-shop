import request from "~/composables/request";
import type {Product,} from './model';

/**
 * 热门推荐
 */
export async function getHotPosts() {
    const res = await request.get<Product[]>('/product/product/get-hot-posts', null, { server: true });
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}

/**
 * 根据uniqueLink查询商品
 */
export async function getProduct(uniqueLink: string) {
  const res = await request.get<Product>(
      '/product/product/getByUniqueLink/' + uniqueLink,null, {server: true}
  );
  if (res.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.message));
}
