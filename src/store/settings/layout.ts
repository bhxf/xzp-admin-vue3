import { defineStore } from 'pinia';

interface LayoutStore {
    headerHeight:number,
    navHeight:number,
    pagePadding:number,
    toolsWidth:number,
    openCardMenu: boolean,
}

const useLayoutStore = defineStore('LayoutStore', {
    state: (): LayoutStore => ({
        headerHeight: 55,
        navHeight: 36,
        pagePadding: 50,
        toolsWidth: 50,
        openCardMenu: false,
    }),
    getters: {
        getPageHeight():string {
            return `calc(100vh - ${this.headerHeight + this.pagePadding + 13}px)`;
        },
        getToolsHeight():string {
            return `calc(100vh - ${this.headerHeight + this.navHeight}px)`;
        },
    },
    actions: {},
});

export default useLayoutStore;
