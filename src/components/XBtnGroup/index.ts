import XBtnGroup from "@/components/XBtnGroup/index.vue";
export default XBtnGroup

export interface Btn {
    icon?: string,
    key: string,
    tooltip: string,
    isDisable?: ()=>boolean
}

