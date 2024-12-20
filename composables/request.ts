import {type UseFetchOptions} from "nuxt/app";
import {type ApiResult} from "~/api";
import {API_BASE_URL, LAYOUT_PATH} from "@/config/setting";

type Methods = "GET" | "POST" | "DELETE" | "PUT";

class HttpRequest {
    request<T = any>(url: string, method: Methods, data: any, options?: UseFetchOptions<T>,): Promise<ApiResult<T>> {
        return new Promise((resolve, reject) => {
            const router = useRouter();
            const { $isMobile } = useNuxtApp();

            const headers = reactive<Record<string, any>>({
                ...options?.headers,
            })

            const token = useCookie("token").value ?? '';

            /**
             * 判断URL是不是需要携带token
             */
            if (!isUrlInBlackTokenList(url)) {
                headers['Authorization'] = token;
            } else if (token) {
                headers['Authorization'] = token;
            }

            /**
             * 只在创建订单的时候携带
             */
            if ('/income/orders/create' === url) {
                headers['Sid'] = useCookie("sid").value ?? '';
            }

            const newOptions: UseFetchOptions<T> = {
                baseURL: API_BASE_URL,
                headers: headers,
                method: method,
                ...options,
            };

            if (method === "GET" || method === "DELETE") {
                newOptions.params = data;
            }

            if (method === "POST" || method === "PUT") {
                newOptions.body = data;
            }

            useFetch(url, newOptions).then((res) => {
                const data = res.data.value as ApiResult<T>;
                // 登录过期处理
                if (data.code === 401) {
                    const currentPath = unref(router.currentRoute).path;
                    if (currentPath == LAYOUT_PATH) {
                        logout(true);
                    } else {
                        if ($isMobile()) {
                            showConfirmDialog({
                                title: '系统提示',
                                message: '登录状态已过期, 请退出重新登录!',
                                confirmButtonText: '重新登陆'
                            }).then(() => {
                                logout(false, currentPath);
                            }).catch(() => {
                                    // on cancel
                            });
                        } else {
                            Modal.destroyAll();
                            Modal.info({
                                title: '系统提示',
                                content: '登录状态已过期, 请退出重新登录!',
                                okText: '重新登录',
                                style: {width: '330px'},
                                onOk: () => {
                                    logout(false, currentPath);
                                }
                            });
                        }
                    }
                    reject(new Error(data.message));
                }

                if (data.code === 403) {
                    navigateTo('/vip');
                }

                // 假设 res 已经是 ApiResult 类型或您可以进行适当的转换
                resolve(data); // 确保解析为 ApiResult<T> 类型
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    // 封装常用方法
    get<T = any> (url: string, params?: any, options?: UseFetchOptions<T>) {
        return this.request(url, "GET", params, options);
    }

    post<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
        return this.request(url, "POST", data, options);
    }

    put<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
        return this.request(url, "PUT", data, options);
    }

    delete<T = any>(url: string, params: any, options?: UseFetchOptions<T>) {
        return this.request(url, "DELETE", params, options);
    }
}

const request = new HttpRequest();

export default request;