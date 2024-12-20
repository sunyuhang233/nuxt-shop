import type {PageParam} from '@/api';

/**
 * 角色
 */
export interface MoneyRecord {
  // 自增ID")
  id?: number;

  // 记录名称")
  name?: string;

  // 金额")
  money?: number;

  // 余额")
  balance?: number;

  // 会员ID")
  memberId?: number;

  // 记录收入类型、0:充值、1、消费")
  recordType?: number;

  // 租户id")
  tenantId?: number;

  // 创建时间")
  createTime?: string;

  // 修改时间")
  updateTime?: string;
}

/**
 * 角色搜索条件
 */
export interface MoneyRecordParam extends PageParam {
  // 自增ID")
  id?: number;

  // 记录名称")
  name?: string;

  // 金额")
  money?: number;

  // 余额")
  balance?: number;

  // 会员ID")
  memberId?: number;

  // 记录收入类型、0:充值、1、消费")
  recordType?: number;
}