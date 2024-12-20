import { API_BASE_URL, LAYOUT_PATH } from "@/config/setting";
import { type ApiResult } from "~/api";

type Methods = "GET" | "POST" | "DELETE" | "PUT";

class HttpRequest {
    async request<T = any>(
        url: string,
        method: Methods,
        data?: any,
        options?: Record<string, any>
    ): Promise<ApiResult<T>> {
        const router = useRouter();
        const { $isMobile } = useNuxtApp();
        const token = useCookie("token").value ?? "";

        // 动态设置 headers
        const headers: Record<string, any> = {
            ...options?.headers,
            ...(token && !isUrlInBlackTokenList(url) ? { Authorization: token } : {}),
            ...(url === "/income/orders/create"
                ? { Sid: useCookie("sid").value ?? "" }
                : {}),
        };

        try {
            const res = await $fetch<ApiResult<T>>(url, {
                baseURL: API_BASE_URL,
                method,
                headers,
                [method === "GET" || method === "DELETE" ? "params" : "body"]: data,
                ...options,
            });

            // 登录过期处理
            if (res.code === 401) {
                const currentPath = unref(router.currentRoute).path;
                if (currentPath === LAYOUT_PATH) {
                    logout(true);
                } else {
                    if ($isMobile()) {
                        await showConfirmDialog({
                            title: "系统提示",
                            message: "登录状态已过期, 请退出重新登录!",
                            confirmButtonText: "重新登陆",
                        });
                        logout(false, currentPath);
                    } else {
                        Modal.destroyAll();
                        Modal.info({
                            title: "系统提示",
                            content: "登录状态已过期, 请退出重新登录!",
                            okText: "重新登录",
                            style: { width: "330px" },
                            onOk: () => logout(false, currentPath),
                        });
                    }
                }
                throw new Error(res.message);
            }

            // 权限不足跳转到会员页面
            if (res.code === 403) {
                navigateTo("/vip");
            }

            return res;
        } catch (error) {
            throw error; // 直接抛出错误供调用方处理
        }
    }

    // 封装常用方法
    get<T = any>(url: string, params?: any, options?: Record<string, any>) {
        return this.request<T>(url, "GET", params, options);
    }

    post<T = any>(url: string, data: any, options?: Record<string, any>) {
        return this.request<T>(url, "POST", data, options);
    }

    put<T = any>(url: string, data: any, options?: Record<string, any>) {
        return this.request<T>(url, "PUT", data, options);
    }

    delete<T = any>(url: string, params: any, options?: Record<string, any>) {
        return this.request<T>(url, "DELETE", params, options);
    }
}

const request = new HttpRequest();

export default request;