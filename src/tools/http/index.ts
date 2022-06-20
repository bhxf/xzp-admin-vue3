import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from '@/plugins/router';
import { notify } from '@/hooks/message';

export enum settingsEnum {
    TOKEN = 'x-token',
    DICTIONARY = 'x-dictionary',
    USER = 'x-user',
    TABS = 'x-tabs',
    TAB = 'x-tab',
    ALL_TAB = 'x-all-tab',
    COLLECT_TAB = 'x-collect-tab',
    COLLECT_ACTIVE_TAB = 'x-collect-active-tab',

    TOKEN_NAME = 'Authorization',
}

// 自定义请求返回数据的类型
interface XData<T> {
    data: T;
    returnCode: string;
    success: boolean;
}

class XRequest {
    config: AxiosRequestConfig;

    instance: AxiosInstance;

    constructor(options: AxiosRequestConfig) {
        this.config = options;
        this.instance = axios.create(options);
        this.setupInterceptor();
    }

    setupInterceptor(): void {
        this.instance.interceptors.request.use(
            (config: AxiosRequestConfig) => new Promise((resolve, reject) => {
                const ignoreAuth = config.headers?.ignoreAuth;
                // 忽略授权
                if (ignoreAuth === true) {
                    resolve(config);
                    return;
                }

                const xToken = sessionStorage.getItem(settingsEnum.TOKEN);
                if (!xToken) {
                    reject('账号已失效');
                    return;
                }

                config.headers && (config.headers[settingsEnum.TOKEN_NAME] = xToken);
                resolve(config);
            }),
            (error: any) => {
                notify.error(error);
            },
        );
        this.instance.interceptors.response.use(
            (config: AxiosResponse) => {
                const { data } = config;
                const route = useRouter;
                return new Promise((resolve, reject) => {
                    if (data.code !== 0) {
                        notify.error(data.msg);
                        reject(data.msg);

                        // 是否需要跳转登录
                        if (data.msg === '授权已过期，请重新登录') {
                            route.push({ path: '/login' });
                        }

                        return;
                    }

                    resolve(data);
                });
            },
            (error: any) => {
                notify.error(error);
                return Promise.reject(error);
            },
        );
    }

    // 类型参数的作用，T决定AxiosResponse实例中data的类型
    request<T = any>(config: AxiosRequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            this.instance
                .request<any, XData<T>>(config)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    get<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({ ...config, method: 'GET' });
    }

    post<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({ ...config, method: 'POST' });
    }

    delete<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({ ...config, method: 'DELETE' });
    }

    put<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({ ...config, method: 'PUT' });
    }

    patch<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({ ...config, method: 'PATCH' });
    }
}

export default XRequest;

export const xRequest = new XRequest({
    baseURL: '/api',
});
