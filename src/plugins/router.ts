import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import {settingsEnum} from "@/tools/http";
import {Notify} from "quasar";
import {useNavTabStore} from "@/store/settings/navigation";

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        meta: {ignoreAuth: true},
        component: () => import('@/layouts/login/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {

    const token = sessionStorage.getItem(settingsEnum.TOKEN)

    //加载菜单
    if (to.path.indexOf('login') === -1 && token) {
        const navStore = useNavTabStore()
        if (!navStore.isLoadMenu) {
            await navStore.getMenuByUser()
            navStore.isLoadMenu = true
            // 触发重定向
            next({...to, replace: true})
            return
        }
    }

    const ignoreAuth = to.meta?.ignoreAuth
    if (ignoreAuth === true) {
        next()
        return
    }

    if (!token) {
        Notify.create(
            {type: 'negative', message: `令牌已失效，请重新登录。`, position: 'top-right'}
        )
        next('/login')
        return
    }

    next()
})

export function setupRouter(app: any) {
    app.use(router)
}

export const useRouter = router
