import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface AgentOrders {
  // 自增id
  agentOrderId?: number;

  // 交易金额
  totalAmount?: number;

  // 交易流水号
  serialNumber?: string;

  // 订单状态
  status?: number;

  // 交易类型(1、新订单, 2、续费订单)
  transactionType?: number;

  // 会员套餐ID
  agentId?: number;

  // 会员ID
  memberId?: number;

  // 支付方式
  paymentType?: string;

  // 支付时间
  paymentTime?: string;

  // 租户id
  tenantId?: number;

  // 订单创建时间
  createTime?: string;

  // 修改时间
  updateTime?: string;
}

/**
 * 角色搜索条件
 */
export interface AgentOrdersParam extends PageParam {
  // 自增id
  agentOrderId?: number;

  // 交易金额
  totalAmount?: number;

  // 交易流水号
  serialNumber?: string;

  // 订单状态
  status?: number;

  // 交易类型(1、新订单, 2、续费订单)
  transactionType?: number;

  // 会员套餐ID
  agentId?: number;

  // 会员ID
  memberId?: number;

  // 支付方式
  paymentType?: string;

  // 支付时间
  paymentTime?: string;
}
