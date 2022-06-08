import XTable from "@/components/XTable/index.vue";
import XSearchForm from "@/components/XTable/XSearchForm.vue";
import {ComponentsType} from "@/components/XForm/index";
export {
    XTable,
    XSearchForm
}

export interface SearchColumn {
    label:string,
    name:string,
    value:any,
    components?:ComponentsType,
    componentsProps?:any,
}

export interface Column {
    name: string,
    label: string,
    field?: string | ((row: any) => any),
    required?: boolean,
    defaultValue?: any,
    autoWidth?: boolean,
    show?: boolean,
    pt?: string,
    align?: "left" | "right" | "center",
    sortable?: boolean,
    sort?: (a: any, b: any, rowA: any, rowB: any) => number,
    sortOrder?: "ad" | "da",
    format?: (val: any, row: any) => any,
    style?: string | ((row: any) => string),
    classes?: string | ((row: any) => string),
    headerStyle?: string,
    headerClasses?: string,
    edit?:boolean,
    components?:ComponentsType,
    componentsProps?:any,
}
export interface ResultColumn {
    name:any,
    value:any,
    type:any,
}
export interface TableRef {
    loadData: (prams?:any) => void,
    addFirst: (row?:any) => void,
    setFullscreen: () => void,
    exitFullscreen: () => void,
}


const componentsOperation:any = {
    input: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    select: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    radio: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    checkbox: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    toggle: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    btnToggle: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    optionGroup: [
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    range:[
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    time:[
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
    date:[
        {label: '等于', value: '='},
        {label: '不等于', value: '!='},
        {label: '大于', value: '>'},
        {label: '大于等于', value: '>='},
        {label: '小于', value: '<'},
        {label: '小于等于', value: '<='},
        {label: '包含', value: 'like'},
        {label: '不包含', value: 'no like'},
    ],
}
export const getComponentsByType = (name:string)=>{
    return componentsOperation[name||'input']
}

