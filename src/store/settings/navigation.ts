import { defineStore } from 'pinia';
import { getBaseMenuTree } from '@/api/system/menu';
import { useRouter } from '@/plugins/router';
import { RouteRecordRaw } from 'vue-router';
import { SettingsEnum } from '@/tools/http';

export interface Meta {
    keepAlive?: boolean;
    defaultMenu?: boolean;
    title: string;
    icon: string;
    closeTab?: boolean;
    collect?: boolean;
}

export interface NavTab {
    ID?: string,
    parentId?: string,
    name?: string,
    icon?: string,
    path?: string,
    meta?: Meta,
    component?: string,
    close?: boolean,
    collect?: boolean,
    children?: NavTab[],
    parameters?: any[]
}

interface NavStore {
    isLoadMenu: boolean,
    openMenu: boolean,
    reload: boolean,
    currentNavTab: NavTab|null,
    currentNavTabs: NavTab[],
    collectNavTabs: NavTab[],
    collectActive: string,
    allNavTabs: NavTab[],
    openCardMenus: NavTab[],
}
const modules = import.meta.glob('@/views/**/*.vue');

const recursionMenu = (router: RouteRecordRaw, menus: NavTab[]) => {
    menus.forEach((item) => {
        const component = modules[`../../views/${item.component}.vue`] || (() => import('@/layouts/error/404.vue'));
        const menu: RouteRecordRaw = {
            name: item.name,
            path: item.path || '',
            meta: item.meta as any,
            component,
        };
        router.children?.push(menu);
        if (item.children && item.children.length > 0) recursionMenu(router, item.children);
    });
};
const treeToList = (addList:NavTab[], list: NavTab[]) => {
    list.forEach((item) => {
        addList.push(item);
        if (item.children && item.children.length > 0) treeToList(addList, item.children);
    });
};

export const useNavTabStore = defineStore('navTabStore', {
    state: (): NavStore => ({
        reload: false,
        openMenu: false,
        isLoadMenu: false,
        currentNavTab: null,
        currentNavTabs: JSON.parse(sessionStorage.getItem(SettingsEnum.TABS) || '[]'),
        collectNavTabs: [],
        allNavTabs: [],
        openCardMenus: [],
        collectActive: sessionStorage.getItem(SettingsEnum.COLLECT_ACTIVE_TAB) || '',
    }),
    getters: {
        getCurrentNavTabIndex(): number {
            return this.currentNavTabs.findIndex((item) => item.path === this.currentNavTab?.path);
        },
        getAllNavTabList():NavTab[] {
            const list:NavTab[] = [];
            treeToList(list, this.allNavTabs);
            return list;
        },
    },
    actions: {
        updateCurrentNavTab(nav: NavTab) {
            this.currentNavTab = nav;
        },
        updateCollectNavTabs(nav: NavTab) {
            const findNav = (allNavTabs:NavTab[], navTab:NavTab) => {
                allNavTabs.forEach((item) => {
                    if (item.path === navTab.path) {
                        item.collect = !item.collect;
                        const index = this.collectNavTabs.findIndex((sub) => sub.path === navTab?.path);
                        if (item.collect) {
                            if (index !== -1) return;
                            this.collectNavTabs.push(navTab);
                        } else {
                            this.collectNavTabs.splice(index, 1);
                        }
                    } else if (item.children && item.children.length > 0) findNav(item.children, navTab);
                });
            };
            // 收藏和取消
            findNav(this.allNavTabs, nav);
        },
        updateCurrentNavTabs() {
            const isExist = this.currentNavTabs.find((item) => item.path === this.currentNavTab?.path);
            if (!isExist && this.currentNavTab) {
                this.currentNavTabs.push(this.currentNavTab);
            }
        },
        updateCurrentNavTabsByPath(path:string) {
            const router = useRouter;
            const isExist = this.currentNavTabs.find((item) => item?.path === path);
            const route = router.getRoutes().find((item) => item.path === path);

            if (!route || route?.meta.openTab === false) return;

            const navTab:NavTab = { path: route?.path, name: route?.name as string, meta: route?.meta as unknown as Meta };
            if (!isExist) {
                this.currentNavTabs.push(navTab);
            }

            this.currentNavTab = navTab;
        },
        updateCurrentNavTabById(path: string) {
            const isExist = this.currentNavTabs.find((item) => item.path === path);
            if (isExist) this.currentNavTab = isExist;
        },
        removeCurrentNavTabById(path: string) {
            const index = this.currentNavTabs.findIndex((item) => item.path === path);
            if (index !== -1) this.currentNavTabs.splice(index, 1);

            // 切换tab 只有当前选中的被删除才会切换tab
            if (this.currentNavTab?.path !== path) return;
            const totalLen = this.currentNavTabs.length;
            // 总长度大于1，有目标可选
            if (totalLen > 0) {
                // 看看向左还是向右
                if (totalLen - index > 1) {
                    // 右 index+1
                    this.currentNavTab = this.currentNavTabs[index];
                } else {
                    // 左 index-1
                    this.currentNavTab = this.currentNavTabs[index - 1];
                }
            }

            if (this.currentNavTab.path) useRouter.push({ path: this.currentNavTab.path as any });
        },
        closeAll() {
            const noClose = this.currentNavTabs.filter((item) => item.close !== true);
            this.currentNavTabs = noClose;
            if (noClose && noClose.length > 0) this.currentNavTab = noClose[0];
        },
        closeLeft(nav: NavTab) {
            const index = this.currentNavTabs.findIndex((item) => item.path === nav.path);
            const currentIndex = this.getCurrentNavTabIndex;

            this.currentNavTabs = this.currentNavTabs.filter((item, i) => (i >= index || item.close !== true));
            if (currentIndex < index) this.currentNavTab = nav;
        },
        closeRight(nav: NavTab) {
            const index = this.currentNavTabs.findIndex((item) => item.path === nav.path);
            const currentIndex = this.getCurrentNavTabIndex;

            this.currentNavTabs = this.currentNavTabs.filter((item, i) => (i <= index || item.close !== true));
            if (currentIndex > index) this.currentNavTab = nav;
        },
        reloadNavTab() {
            this.reload = true;
            if (this.currentNavTab?.meta?.keepAlive === true) {
                this.currentNavTabs.forEach((item) => {
                    if (item.path === this.currentNavTab?.path) {
                        if (item?.meta?.keepAlive === true) item.meta.keepAlive = false;
                    }
                });
            }
            setTimeout(() => {
                this.reload = false;
                if (this.currentNavTab?.meta?.keepAlive === true) {
                    this.currentNavTabs.forEach((item) => {
                        if (item.path === this.currentNavTab?.path) {
                            if (item?.meta?.keepAlive === false) item.meta.keepAlive = true;
                        }
                    });
                }
            }, 200);
        },

        async getMenuByUser() {
            const result = await getBaseMenuTree();
            const router = useRouter;

            this.allNavTabs = result.menus || [];

            this.initCollect();

            const parentRouter: RouteRecordRaw = {
                name: 'main',
                path: '/',
                component: () => import('@/layouts/Main.vue'),
                redirect: 'dashboard',
                children: [],
            };
            recursionMenu(parentRouter, result.menus);

            const noFound: RouteRecordRaw = { path: '/404', component: () => import('@/layouts/error/404.vue') };
            const other: RouteRecordRaw = { path: '/500', component: () => import('@/layouts/error/500.vue'), meta: { ignoreAuth: true } };
            const noFoundAll: RouteRecordRaw = { path: '/:pathMatch(.*)', redirect: '/404' };
            parentRouter.children?.push(noFound);
            parentRouter.children?.push(other);
            parentRouter.children?.push(noFoundAll);

            router.addRoute(parentRouter);
        },

        initCollect() {
            function recursionTab(list:NavTab[], collectNavTabs:NavTab[]) {
                list.forEach((item) => {
                    if (item.meta?.collect === true) {
                        collectNavTabs.push(item);
                    }
                    if (item.children && item.children.length > 0) recursionTab(item.children, collectNavTabs);
                });
            }

            recursionTab(this.allNavTabs, this.collectNavTabs);
        },
    },
});
