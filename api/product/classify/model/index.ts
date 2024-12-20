import type {PageParam} from '@/api';
import type {ProductDto} from "~/api/product/product/model";

/**
 * 角色
 */
export interface Classify {
  // 分类id
  classifyId?: number;

  // 分类名称
  name?: string;

  // 分类图标，存储图标文件的路径或URL
  icon?: string;

  // 商品数量
  productCount?: number;

  // 分类状态
  status?: number;

  // 分类排序
  sortOrder?: number;

  // 租户id
  tenantId?: number;

  // 创建时间
  createTime?: string;

  // 修改时间
  updateTime?: string;
}

export interface ClassifyDto {
  // 分类id
  classifyId?: number;

  // 分类名称
  name?: string;

  // 分类图标，存储图标文件的路径或URL
  icon?: string;

  // 分类状态
  status?: number;

  // 商品数量
  productCount?: number;

  // 商品列表
  products?: ProductDto[];
}

/**
 * 角色搜索条件
 */
export interface ClassifyParam extends PageParam {
  // 分类id
  classifyId?: number;

  // 分类名称
  name?: string;

  // 分类图标，存储图标文件的路径或URL
  icon?: string;

  // 分类状态
  status?: number;
}
