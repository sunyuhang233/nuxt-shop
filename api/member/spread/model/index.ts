/**
 * 订单参数
 */
export interface CreateWithdrawParam {
    // 支付宝账户
    account?: string;
    // 支付宝姓名
    username?: string;
}

/**
 * 划转佣金参数
 */
export interface TransferMoneyParam {
    // 金额
    money?: number;
}