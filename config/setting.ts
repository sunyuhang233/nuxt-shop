// 接口地址
export const API_BASE_URL: string = import.meta.env.VITE_API_URL;

// 项目名称
export const PROJECT_NAME: string = import.meta.env.VITE_APP_NAME;

// 首页路径, 为空则取第一个菜单的地址
export const HOME_PATH: string | undefined = undefined;

// 外层布局的路由地址
export const LAYOUT_PATH = '/';

// 需要鉴权的路由
export const BLACK_LIST: string[] = [
    '/user',
    '/user/orders',
    '/user/spread',
    '/user/wallet',
    '/user/join-agent'
];

// 不需要携带Token的API接口
export const BLACK_TOKEN_LIST: string[] = [
    '/product/classify/list',
    '/product/product/get-hot-posts',
    '/product/product/getByUniqueLink/**',
    '/member/member/login',
    '/member/member/sendEmailVerificationCode',
    '/content/article/list',
    '/settings/pay-config',
    '/settings/store-setting'
];