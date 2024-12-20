import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface RebateRecord {
  // 自增id
  id?: number;

  // 上级会员昵称
  superiorNickName?: string;

  // 购买的产品
  productName?: string;

  // 订单金额
  money?: number;

  // 返利佣金
  brokerage?: number;

  // 支付日期
  paymentTime?: string;

  // 订单id
  orderId?: string;

  // 会员id
  memberId?: number;

  // 租户id
  tenantId?: number;

  // 创建时间
  createTime?: string;

  // 创建时间
  updateTime?: string;
}

/**
 * 角色搜索条件
 */
export interface RebateRecordParam extends PageParam {
  // 自增id
  id?: number;

  // 上级会员昵称
  superiorNickName?: string;

  // 购买的产品
  productName?: string;

  // 订单金额
  money?: number;

  // 返利佣金
  brokerage?: number;

  // 支付日期
  paymentTime?: string;

  // 订单id
  orderId?: string;
}