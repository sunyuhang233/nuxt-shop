import request from "~/composables/request";
import type {Article, ArticleParam} from "./model";
import type {CategoryArticleDto} from "~/api/content/article-category/model";

/**
 * 查询文章列表
 */
export async function listArticles(params?: ArticleParam) {
  const res = await request.get<CategoryArticleDto[]>('/content/article/list', { ...params }, { server: true });
  if (res.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.message));
}

/**
 * 根据id查询文章
 */
export async function getArticle(id?: number) {
  const res = await request.get<Article>('/content/article/getById/' + id, null, {server: true});
  if (res.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.message));
}
