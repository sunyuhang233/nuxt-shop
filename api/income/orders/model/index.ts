import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface Order {
  // 订单ID
  orderId?: number;

  // 订单状态
  status?: number;

  // 订单数量
  number?: number;

  // 商品ID
  productId?: number;

  // 发货模式
  shippingType?: number;

  // 支付类型
  paymentType?: string;

  // 买家IP
  buyerIp?: string;

  // 购买设备
  buyDevice?: string;

  // 流水号
  serialNumber?: string;

  // 总金额
  totalAmount?: number;

  // 是否使用优惠券
  isCoupon?: number;

  // 优惠券ID
  couponId?: number;

  // 卡密信息
  cardSecretInfo?: string;

  // 附加信息
  attachInfo?: string;

  // 使用说明
  instructions?: string;

  // 会员ID
  memberId?: number;

  // 租户ID
  tenantId?: number;

  // 支付时间
  paymentTime?: string;

  // 创建时间
  createTime?: string;
}

export interface OrdersDto {
  // 订单ID
  orderId?: number;

  // 订单状态
  status?: number;

  // 订单数量
  number?: number;

  // 是否启用类别
  categoryEnabled?: number;

  // 商品ID
  productId?: number;

  // 商品封面
  coverImage?: string;

  // 商品名称
  productName?: string;

  // 商品链接
  uniqueLink?: string;

  // 品类名称
  categoryName?: string;

  // 发货模式
  shippingType?: number;

  // 卡密类型
  cardType?: number;

  // 支付类型
  paymentType?: string;

  // 流水号
  serialNumber?: string;

  // 总金额
  totalAmount?: number;

  // 卡密信息
  cardSecretInfo?: string;

  // 使用说明
  instructions?: string;

  // 支付时间
  paymentTime?: string;

  // 创建时间
  createTime?: string;
}

export interface CreateOrdersParam {
  // 商品id
  productId?: number;
  // 品类id
  categoryId?: number;
  // 折扣代码
  couponCode?: string;
  // 购买数量
  number?: number;
  // 支付方式
  paymentType?: string;
  // 动态字段
  dynamicFields?: Record<string, any>;
}

/**
 * 角色搜索条件
 */
export interface OrderParam extends PageParam {
  // 订单ID
  orderId?: number;

  // 订单状态
  status?: number;

  // 订单数量
  number?: number;

  // 商品ID
  productId?: number;

  // 发货模式
  shippingType?: number;

  // 支付类型
  paymentType?: string;

  // 会员ID
  memberId?: number;

  // 流水号
  serialNumber?: string;

}

export interface PaymentResult {
  // 订单ID
  orderId?: number;

  // 总金额
  totalAmount?: number;

  paymentType?: string;

  paymentMsg?: string;

  paymentUrl?: string;
}
