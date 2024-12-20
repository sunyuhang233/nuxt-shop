import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface Category {
  // 类别ID
  categoryId?: number;

  // 商品id
  productId?: number;

  // 类别名称
  name?: string;

  // 类别封面图片URL
  coverImage?: string;

  // 类别价格
  price?: number;

  // 类别原价
  costPrice?: number;

  // 类别排序
  sortOrder?: number;

  // 类别状态（例如：1为激活，0为非激活）
  status?: number;

  // 是否启用批发功能
  wholesaleEnabled?: number;

  // 批发配置（JSON格式或其他）
  wholesaleConfig?: string;

  // 卡密类型
  cardType?: number;

  // 最低购买数量
  minPurchaseQuantity?: number;

  // 最大购买数量
  maxPurchaseQuantity?: number;

  // 发货类型
  shippingType?: number;

  // 商品库存
  inventory?: number;

  // 销量
  salesVolume?: number;

  // 是否开启自定义输入框
  customInputEnabled?: number;

  // 自定义输入框内容
  customInput?: string;

  // 卡密使用说明
  usageInstructions?: string;

  // 未使用卡密数量
  unusedCount?: number;

  // 未使用卡密数量
  usedCount?: number;

  // 租户id
  tenantId?: number;

  // 创建时间
  createTime?: string;

  // 修改时间
  updateTime?: string;
}

/**
 * 角色搜索条件
 */
export interface CategoryParam extends PageParam {
  // 类别ID
  categoryId?: number;

  // 商品id
  productId?: number;

  // 类别名称
  name?: string;

  // 类别排序
  sortOrder?: number;

  // 类别状态（例如：1为激活，0为非激活）
  status?: number;
}
