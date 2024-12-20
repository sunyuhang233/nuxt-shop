import type {PageParam} from "@/api";

export interface StoreSetting {
  // 唯一id
  id?: number;

  // 网站名称
  websiteName?: string;

  // Favicon
  favicon?: string;

  // SEO关键词
  keywords?: string;

  // 网站描述
  description?: string;

  // 网站图标
  websiteIcon?: string;

  // 网站介绍
  introduction?: string;

  // 首页公告
  placard?: string;

  // 是否开启弹窗通知
  isDialogMessage?: number;

  // 弹窗通知
  dialogMessage?: string;

  // 返利比例
  rebateRatio?: number;

  // 最低提现金额
  minWithdrawAmount?: number;

  // 最低充值金额
  minDepositAmount?: number;

  // 是否启用crisp
  enableCrisp?: number;

  // crisp Website ID
  crispWebsiteId?: string;

  // 客服配置
  customerServiceConfig?: string;

  // 工作时间配置
  workTimeConfig?: string;

  // 商店服务配置
  storeServiceConfig?: string;

  // 紧急消息
  urgentMessage?: string;

  // 租户id
  tenantId?: number;

  // 创建时间
  createTime?: string;

  // 修改时间
  updateTime?: string;
}

export interface CustomerServiceConfig {
  label?: string;
  name?: string;
  type?: string;
  url?: string;
}

/**
 * 用户搜索条件
 */
export interface StoreSettingParam extends PageParam {
  name?: string;
  status?: number;
}
