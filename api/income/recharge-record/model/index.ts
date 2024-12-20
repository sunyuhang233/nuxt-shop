import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface RechargeRecord {
  // 充值ID
  rechargeId?: number;

  // 充值名称
  name?: string;

  // 会员ID
  memberId?: number;

  // 总金额
  totalAmount?: number;

  // 支付状态
  status?: number;

  // 支付类型
  paymentType?: string;

  // 支付时间
  paymentTime?: string;

  // 流水号
  serialNumber?: string;

  // 租户id
  tenantId?: number;

  // 创建日期
  createTime?: string;

  // 更新日期
  updateTime?: string;
}

export interface RechargeParam {
  money?: number;
  paymentType?: string;
}

/**
 * 角色搜索条件
 */
export interface RechargeRecordParam extends PageParam {
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
