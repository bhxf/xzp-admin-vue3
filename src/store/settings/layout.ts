import { defineStore } from 'pinia';

interface LayoutStore {
    headerHeight:number,
    navHeight:number,
    pagePadding:number,
    toolsWidth:number,
}

export const useLayoutStore = defineStore('LayoutStore', {
  state: (): LayoutStore => ({
    headerHeight: 55,
    navHeight: 36,
    pagePadding: 60,
    toolsWidth: 50,
  }),
  getters: {
    getPageHeight():string {
      return `calc(100vh - ${this.headerHeight + this.navHeight + this.pagePadding}px)`;
    },
    getToolsHeight():string {
      return `calc(100vh - ${this.headerHeight + this.navHeight}px)`;
    },
  },
  actions: {},
});
