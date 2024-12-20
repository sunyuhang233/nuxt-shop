import {BLACK_LIST, LAYOUT_PATH} from "~/config/setting";
import {useMemberStore} from "~/store/useMemberStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const { $isMobile } = useNuxtApp();
    const token = useCookie('token');
    if (typeof (token.value) == 'undefined' || token.value == '') {
        // 未登录跳转登录界面
        if (BLACK_LIST.includes(to.path)) {
            if (process.client) {
                if ($isMobile()) {
                    showNotify({ type: 'warning', message: '您还未登陆、请登陆后再试。' });
                } else {
                    message.warning('您还未登陆、请登陆后再试。')
                }
                return navigateTo({
                    path: '/login',
                    query: to.path === LAYOUT_PATH ? {} : { from: to.path }
                });
            }
            if (to.path == from.path) {
                return navigateTo('/');
            }
            return abortNavigation();
        }
    } else {
        const memberStore = useMemberStore();
        if (!memberStore.info) {
            memberStore.fetchMemberInfo();
        }
    }
})