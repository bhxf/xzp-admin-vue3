import { defineStore } from 'pinia';
import { getBaseMenuTree } from '@/api/system/menu';
import { useRouter } from '@/plugins/router';
import { RouteRecordRaw } from 'vue-router';
import { settingsEnum } from '@/tools/http';
import { loading } from '@/hooks/message';
import NavTabs from '@/layouts/navigation/NavTabs.vue';

export interface Meta {
    keepAlive?: boolean;
    defaultMenu?: boolean;
    title: string;
    icon: string;
    closeTab?: boolean;
}

export interface NavTab {
    ID: string,
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
    currentNavTab: NavTab,
    currentNavTabs: NavTab[],
    collectNavTabs: NavTab[],
    collectActive: string,
    allNavTabs: NavTab[],
}

const defaultNavTab: NavTab = {
  ID: '1',
  name: 'dashboard',
  path: 'dashboard',
  meta: { title: '首页', icon: 'o_other_houses' },
  close: false,
};
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
    item.children && item.children.length > 0 && treeToList(addList, item.children);
  });
};

export const useNavTabStore = defineStore('navTabStore', {
  state: (): NavStore => ({
    reload: false,
    openMenu: false,
    isLoadMenu: false,
    currentNavTab: JSON.parse(sessionStorage.getItem(settingsEnum.TAB) || '{}'),
    currentNavTabs: JSON.parse(sessionStorage.getItem(settingsEnum.TABS) || '[]'),
    collectNavTabs: JSON.parse(sessionStorage.getItem(settingsEnum.COLLECT_TAB) || '[]'),
    allNavTabs: [],
    collectActive: sessionStorage.getItem(settingsEnum.COLLECT_ACTIVE_TAB) || '',
  }),
  getters: {
    getCurrentNavTabIndex(): number {
      return this.currentNavTabs.findIndex((item) => item.ID === this.currentNavTab?.ID);
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
      const findNav = (allNavTabs:NavTab[], nav:NavTab) => {
        allNavTabs.forEach((item) => {
          if (item.ID === nav.ID) {
            item.collect = !item.collect;
            const index = this.collectNavTabs.findIndex((item) => item.ID === nav?.ID);
            if (item.collect) {
              if (index !== -1) return;
              this.collectNavTabs.push(nav);
            } else {
              this.collectNavTabs.splice(index, 1);
            }
          } else {
            item.children && item.children.length > 0 && findNav(item.children, nav);
          }
        });
      };
      // 收藏和取消
      findNav(this.allNavTabs, nav);

      sessionStorage.setItem(settingsEnum.COLLECT_TAB, JSON.stringify(this.collectNavTabs));
    },
    updateCurrentNavTabs() {
      const isExist = this.currentNavTabs.find((item) => item.ID === this.currentNavTab?.ID);
      if (!isExist && this.currentNavTab) {
        this.currentNavTabs.push(this.currentNavTab);
      }
    },
    updateCurrentNavTabById(ID: string) {
      const isExist = this.currentNavTabs.find((item) => item.ID === ID);
      if (isExist) this.currentNavTab = isExist;
    },
    removeCurrentNavTabById(ID: string) {
      const index = this.currentNavTabs.findIndex((item) => item.ID === ID);
      if (index !== -1) this.currentNavTabs.splice(index, 1);

      // 切换tab 只有当前选中的被删除才会切换tab
      if (this.currentNavTab?.ID !== ID) return;
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
    },
    closeAll() {
      const noClose = this.currentNavTabs.filter((item) => item.close !== true);
      this.currentNavTabs = noClose;
      this.currentNavTab = noClose[0];
    },
    closeLeft(nav: NavTab) {
      const index = this.currentNavTabs.findIndex((item) => item.ID === nav.ID);
      const currentIndex = this.getCurrentNavTabIndex;

      this.currentNavTabs = this.currentNavTabs.filter((item, i) => (i >= index || item.close !== true));
      if (currentIndex < index) this.currentNavTab = nav;
    },
    closeRight(nav: NavTab) {
      const index = this.currentNavTabs.findIndex((item) => item.ID === nav.ID);
      const currentIndex = this.getCurrentNavTabIndex;

      this.currentNavTabs = this.currentNavTabs.filter((item, i) => (i <= index || item.close !== true));
      if (currentIndex > index) this.currentNavTab = nav;
    },
    reloadNavTab() {
      this.reload = true;
      setTimeout(() => this.reload = false, 500);
    },

    async getMenuByUser() {
      loading.base('正在加载菜单，请稍等...');
      try {
        const result = await getBaseMenuTree();
        const router = useRouter;

        this.allNavTabs = result.menus || [];

        const parentRouter: RouteRecordRaw = {
          name: 'main',
          path: '/',
          component: () => import('@/layouts/Main.vue'),
          redirect: '/dashboard',
          children: [],
        };
        recursionMenu(parentRouter, result.menus);

        const noFound: RouteRecordRaw = { path: '/404', component: () => import('@/layouts/error/404.vue') };
        const noFoundAll: RouteRecordRaw = { path: '/:pathMatch(.*)', redirect: '/404' };
        parentRouter.children?.push(noFound);
        parentRouter.children?.push(noFoundAll);

        router.addRoute(parentRouter);
      } catch (e) {
        console.log(e);
      } finally {
        loading.hide();
      }
    },
  },
});
