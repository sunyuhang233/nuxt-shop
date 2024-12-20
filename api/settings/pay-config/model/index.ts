import type {PageParam} from "@/api";

export interface PayConfig {
  id?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 驱动
   */
  driver?: string;
  /**
   * 配置
   */
  config?: string;
  /**
   * 说明
   */
  comment?: string;
  /**
   * 排序
   */
  sortNumber?: number;
  /**
   * 状态
   */
  status?: number;
  /**
   * 电脑端
   */
  isDesktop?: number;

  /**
   * 移动端
   */
  isMobile?: number;
  /**
   * 租户id
   */
  tenantId?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}

/**
 * 用户搜索条件
 */
export interface PayConfigParam extends PageParam {
  name?: string;
  status?: number;
}
