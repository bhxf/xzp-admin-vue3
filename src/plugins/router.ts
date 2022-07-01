import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { SettingsEnum } from '@/tools/http';
import { useNavTabStore } from '@/store/settings/navigation';
import { notify } from '@/hooks/message';

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        meta: { ignoreAuth: true, openTab: false },
        component: () => import('@/layouts/login/index.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const navStore = useNavTabStore();
    navStore.updateCurrentNavTabsByPath(to.path);

    // 是否需要授权
    const ignoreAuth = to.meta?.ignoreAuth;
    if (ignoreAuth === true) {
        next();
        return;
    }

    // 是否已登录过
    const token = sessionStorage.getItem(SettingsEnum.TOKEN);
    if (!token) {
        notify.error('令牌已失效，请重新登录');
        next({ path: '/login' });
        return;
    }

    // 加载菜单
    if (!navStore.isLoadMenu) {
        const oldNotify = notify.loading('正在加载菜单...');
        try {
            await navStore.getMenuByUser();
            navStore.isLoadMenu = true;
            next({ ...to, replace: true });
            notify.done(oldNotify, '菜单已加载完成');
        } catch (e) {
            notify.done(oldNotify, '菜单加载失败');
            next({ path: '/login' });
        } finally {
            navStore.isLoadMenu = true;
        }
    } else {
        next();
    }
});
router.afterEach(() => {
});

export function setupRouter(app: any) {
    app.use(router);
}

export const useRouter = router;
