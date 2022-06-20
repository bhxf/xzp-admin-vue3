import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { settingsEnum } from '@/tools/http';
import { Notify } from 'quasar';
import { useNavTabStore } from '@/store/settings/navigation';
import { loading } from '@/hooks/message';

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
    const token = sessionStorage.getItem(settingsEnum.TOKEN);
    if (!token) {
        Notify.create(
            { type: 'negative', message: '令牌已失效，请重新登录。', position: 'top-right' },
        );
        next({ path: '/login' });
        return;
    }

    // 加载菜单
    if (!navStore.isLoadMenu) {
        try {
            loading.base('菜单加载中，请稍等...');
            await navStore.getMenuByUser();
            navStore.isLoadMenu = true;
            next({ ...to, replace: true });
        } catch (e) {
            next({ path: 'error' });
        } finally {
            loading.hide();
        }
    } else {
        next();
    }
});

export function setupRouter(app: any) {
    app.use(router);
}

export const useRouter = router;
