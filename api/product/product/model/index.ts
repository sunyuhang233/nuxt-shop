import type {PageParam} from '@/api';
import type {Category} from "~/api/product/category/model";

/**
 * 角色
 */
export interface Product {
  // 商品id
  productId?: number;

  // 分类ID
  classifyId?: number;

  // 分类名称
  classifyName?: string;

  // 商品名称
  name?: string;

  // 商品价格
  price?: number;

  // 成本价格
  costPrice?: number;

  // 商品介绍
  description?: string;

  // 商品详情
  details?: string;

  // 商品状态
  status?: number;

  // 商品封面图片URL
  coverImage?: string;

  // 卡密类型
  cardType?: number;

  // 最低购买数量
  minPurchaseQuantity?: number;

  // 最大购买数量
  maxPurchaseQuantity?: number;

  // 是否启用批发功能
  wholesaleEnabled?: number;

  // 批发配置（JSON格式或其他）
  wholesaleConfig?: string;

  // 发货类型
  shippingType?: number;

  // 商品库存
  inventory?: number;

  // 销量
  salesVolume?: number;

  // 是否开启密码查询
  passwordEnabled?: number;

  // 是否开启自定义输入框
  customInputEnabled?: number;

  // 自定义输入框内容
  customInput?: string;

  // 是否启用类别
  categoryEnabled?: number;

  // 是否开启弹窗通知
  popupNotificationEnabled?: number;

  // 通知内容
  notificationContent?: string;

  // 商品链接（唯一）
  uniqueLink?: string;

  // 卡密使用说明
  usageInstructions?: string;

  // 商品排序
  sortOrder?: number;

  // 未使用卡密数量
  unusedCount?: number;

  // 未使用卡密数量
  usedCount?: number;

  // 品类列表
  categoryList?: Category[];

  // 租户id
  tenantId?: number;

  // 注册时间
  createTime?: string;

  // 修改时间
  updateTime?: string;
}

export interface ProductDto {
  // 商品id
  productId?: number;

  // 商品名称
  name?: string;

  // 商品价格
  price?: number;

  // 成本价格
  costPrice?: number;

  // 商品介绍
  description?: string;

  // 商品状态
  status?: number;

  // 商品封面图片URL
  coverImage?: string;

  // 发货类型
  shippingType?: number;

  // 卡密使用说明
  usageInstructions?: string;

  // 商品链接（唯一）
  uniqueLink?: string;

  // 未使用卡密数量
  unusedCount?: number;

  // 已使用卡密数量
  usedCount?: number;

  // 创建时间
  createTime?: string;
}

/**
 * 角色搜索条件
 */
export interface ProductParam extends PageParam {
  // 商品id
  productId?: number;

  // 分类ID
  classifyId?: number;

  // 商品名称
  name?: string;

  // 发货类型
  shippingType?: number;

}
