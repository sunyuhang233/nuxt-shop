import {type PageParam} from "@/api";
import type {ArticleDto} from "~/api/content/article/model";

export interface ArticleCategory {
  // 自增ID
  id?: number;

  // 类别标题
  name?: string;

  // 类别简介
  summary?: string;

  // 封面
  cover?: string;

  // 别名
  alias?: string;

  // 类别状态
  status?: number;

  // 排序
  sortNumber?: number;

  // 查看数量
  seeNumber?: number;

  // 租户id
  tenantId?: number;

  // 添加时间
  createTime?: string;

  // 修改时间
  updateTime?: string;
}

export interface CategoryArticleDto {
  // 自增ID
  id?: number;

  // 类别标题
  name?: string;

  // 简介
  summary?: string;

  // 封面
  cover?: string;

  // 别名
  alias?: string;

  // 文章数量
  articleCount?: number;

  // 文章列表
  articleDtoList?: ArticleDto[];
}

/**
 * 文章搜索条件
 */
export interface ArticleCategoryParam extends PageParam {
  // 自增ID
  id?: number;

  // 类别标题
  name?: string;

  // 别名
  alias?: string;

  // 类别状态
  status?: number;
}
