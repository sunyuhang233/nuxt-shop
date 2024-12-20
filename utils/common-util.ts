import {BLACK_TOKEN_LIST} from "~/config/setting";

export type TypeColorMapping = {
    name: string;
    color: string;
};

export function isUrlInBlackTokenList(url: string): boolean {
    return BLACK_TOKEN_LIST.some(pattern => {
        if (pattern.endsWith('/**')) {
            // 如果模式以 '/**' 结尾，将其替换为正则表达式
            const regexPattern = new RegExp(`^${pattern.replace('/**', '(/|$)')}`);
            return regexPattern.test(url);
        } else {
            // 不以 '/**' 结尾的模式，进行全字符串匹配
            const regexPattern = new RegExp(`^${pattern}$`);
            return regexPattern.test(url);
        }
    });
}

/**
 * 这段代码定义了一个 getNameAndColor 函数，
 * 它接受一个字符串类型的参数，并返回一个对象，
 * 其中包含对应的名称和颜色。如果给定的类型在映射中不存在，
 * 函数将返回 undefined。您可以根据自己的需求添加或修改类型和它们对应的名称和颜色。
 * @param type
 */
export function getNameAndColor(type: string): TypeColorMapping {
    const mapping: { [key: string]: TypeColorMapping } = {
        balance: { name: '余额', color: '#ffbd27', icon: '/assets/images/payment/balance.svg' },
        epay_alipay: {
            name: '支付宝',
            color: '#02A8F1',
            icon: '/assets/images/payment/balance.svg'
        },
        xunhu_wxpay: {
            name: '微信',
            color: '#1fbe1f',
            icon: '/assets/images/payment/wechat.svg'
        },
        epusdt: {
            name: 'USDT',
            color: '#27a17b',
            icon: '/assets/images/payment/usdt.svg'
        },
        cryptomus: {
            name: 'USDT',
            color: '#27a17b',
            icon: '/assets/images/payment/usdt.svg'
        },
        alipay: {
            name: '当面付',
            color: '#02A8F1',
            icon: '/assets/images/payment/alipay.svg'
        },
        alipay_pc: {
            name: '支付宝',
            color: '#02A8F1',
            icon: '/assets/images/payment/alipay.svg'
        }
        // 您可以根据需要添加更多类型
    }
    return mapping[type]
}

/**
 * 生成并下载文本文件
 * @param content - 要下载的文本内容
 * @param filename - 下载文件的名称
 */
export function downloadTxtFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    link.click();
    URL.revokeObjectURL(link.href);
}