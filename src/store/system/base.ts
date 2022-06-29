import { defineStore } from 'pinia';
import { login, LoginRequest, User } from '@/api/system/login';
import { useRouter } from '@/plugins/router';
import { SettingsEnum } from '@/tools/http';
import { dialog, loading, notify } from '@/hooks/message';
import { getSysDictionaryDetailAllList } from '@/api/system/dictionary';

interface BaseStore {
    user: User | null,
    token: string | null,
}

export const getUser = () => {
    const user = sessionStorage.getItem(SettingsEnum.USER);
    return user && JSON.parse(user);
};
export const resetDictionary = async () => {
    const dictionary = await getSysDictionaryDetailAllList();
    sessionStorage.setItem(SettingsEnum.DICTIONARY, JSON.stringify(dictionary.list));
};

export const useBaseStore = defineStore('baseStore', {
    state: (): BaseStore => <BaseStore>{
        user: getUser(),
        token: '',
    },
    getters: {
    },
    actions: {
        clearUser() {
            this.user = null;
            this.token = null;
            sessionStorage.clear();
        },
        async handlerLogin(data: LoginRequest) {
            loading.base('正在登录系统，请稍等...');

            try {
                const result = await login(data);
                this.user = result.user;
                this.token = result.token;
                sessionStorage.setItem(SettingsEnum.TOKEN, result.token);
                sessionStorage.setItem(SettingsEnum.USER, JSON.stringify(result.user));

                // 获取字典
                await resetDictionary();

                const router = useRouter;
                await router.push({ path: '/' });

                notify.success(`欢迎${this.user?.userName}回来`);
            } catch (e:any) {
                throw new Error(e.toString());
            } finally {
                loading.hide();
            }
        },
        async handlerLogout() {
            dialog.confirm('退出提示', '确定要注销账号吗？', async () => {
                const router = useRouter;
                await router.push({ path: '/login' });
                notify.success(`${this.user?.userName}已退出系统`);
                this.clearUser();
            }, () => {});
        },
    },
});
