import type { PageParam } from '@/api';

/**
 * 角色
 */
export interface AgentPackage {
  // 会员套餐ID
  agentId?: number;

  // 套餐名称
  packageName?: string;

  // 描述
  description?: string;

  // 价格
  price?: number;

  // 成本价格
  costPrice?: number;

  // 佣金比率
  commissionRate?: number;

  // 特权描述
  privileges?: string;

  // 开通时间
  billingCycleDays?: number;

  // 状态
  status?: number;

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
export interface AgentPackageParam extends PageParam {
  // 会员套餐ID
  agentId?: number;

  // 套餐名称
  packageName?: string;

  // 价格
  price?: number;

  // 状态
  status?: number;
}
