import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { SettingsEnum } from '@/tools/http';
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
    loading.base('菜单加载中，请稍等...');

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
        Notify.create(
            { type: 'negative', message: '令牌已失效，请重新登录。', position: 'top-right' },
        );
        next({ path: '/login' });
        return;
    }

    // 加载菜单
    if (!navStore.isLoadMenu) {
        try {
            await navStore.getMenuByUser();
            navStore.isLoadMenu = true;
            next({ ...to, replace: true });
        } catch (e) {
            next({ path: 'error' });
        } finally {
            navStore.isLoadMenu = true;
        }
    } else {
        next();
    }
});
router.afterEach(() => {
    loading.hide();
});

export function setupRouter(app: any) {
    app.use(router);
}

export const useRouter = router;
