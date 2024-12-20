export interface Member {
  // 自增id
  id?: number;
  // 邀请链接
  sid?: string;
  // 昵称
  nickName?: string;
  // 头像
  avatar?: string;
  // 性别
  sex?: number;
  // 邮箱
  email?: string;
  // 邮箱是否验证,0否,1是
  emailVerified?: number;
  // 状态,0正常,1冻结
  state?: number;
  // 余额
  balance?: number;
  // 返利金额
  rebateAmount?: number;
  // 返利比例
  rebatePercentage?: number;
  // 冻结余额
  freezeBalance?: number;
  // 订单数量
  totalOrdersCount?: number;
  // 返利订单数量
  totalRebateOrdersCount?: number;
  // 是否删除,0否,1是
  deleted?: number;
  // 个人简介
  introduction?: string;
  // 是否为会员, 如 0 表示否，1 表示是
  isAgent?: number;
  // 会员套餐ID, 关联会员套餐表, 如果不是会员则为 null
  agentPackageId?: number;
  // 会员到期时间
  agentExpireDate?: string;
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 登录参数
 */
export interface LoginParam {
  // 账号
  email?: string;
  // 验证码
  code?: string;
  // 租户id
  tenantId?: number;
  // 是否记住密码
  remember?: boolean;
}

/**
 * 登录返回结果
 */
export interface LoginResult {
  // token
  access_token?: string;
  // 授权地址
  authorizeUrl?: string;
}

/**
 * 登录返回结果
 */
export interface EmailParam {
  sendType?: string;
  // token
  email?: string;
}