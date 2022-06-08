import XBtnGroup from "@/components/XBtnGroup/index.vue";
export default XBtnGroup

export interface Btn {
    key: string,
    tooltip: string,
    isDisable?: ()=>boolean
}

