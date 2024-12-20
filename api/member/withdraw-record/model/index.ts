import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface WithdrawRecord {
  // 自增ID
  id?: number;

  // 提现类型
  withdrawType?: string;

  // 支付宝账号
  account?: string;

  // 支付宝姓名
  username?: string;

  // 金额
  money?: number;

  // 提现状态
  status?: string;

  // 提现说明
  summary?: string;

  // 会员ID
  memberId?: number;

  // 租户id
  tenantId?: number;

  // 创建时间
  createTime?: string;

  // 更新时间
  updateTime?: string;
}

/**
 * 角色搜索条件
 */
export interface WithdrawRecordParam extends PageParam {
  // 自增ID
  id?: number;

  // 提现类型
  withdrawType?: string;

  // 支付宝账号
  account?: string;

  // 支付宝姓名
  username?: string;

  // 金额
  money?: number;

  // 提现状态
  status?: string;
}