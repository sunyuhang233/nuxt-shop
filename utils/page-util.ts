import {HOME_PATH, LAYOUT_PATH} from "~/config/setting";
import {useMemberStore} from "~/store/useMemberStore";

/**
 * 登录成功后跳转首页
 * @param from 登录前的地址
 */
export function goHomeRoute(from?: string) {
    const HOME_ROUTE = HOME_PATH || LAYOUT_PATH;
    navigateTo({
        path: from || HOME_ROUTE,
        replace: true
    });
}

/**
 * 退出登录
 * @param route 是否使用路由跳转
 * @param from 登录后跳转的地址
 */
export function logout(route?: boolean, from?: string) {
    const router = useRouter();

    // 清空token
    const cookie = useCookie('token');
    cookie.value = undefined;

    // 清空用户数据
    useMemberStore().removeInfo();

    if (route) {
        router.push({
            path: '/login',
            query: from ? { from } : void 0
        });
    } else {
        // 这样跳转避免再次登录重复注册动态路由
        location.replace('/login' + (from ? '?from=' + from : ''));
    }
}
