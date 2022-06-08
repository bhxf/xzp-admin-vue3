import {formatChip} from "@/tools/format";
import {Field} from "@/components/XForm/index";
import {Column, SearchColumn} from "@/components/XTable/index";

export const dictionaryForm: Field[] = [
    {
        label: `名称`, name: `name`, col: 12, components: 'input', required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入名称')],
        }
    },
    {
        label: `编码`, name: `type`, col: 12, components: 'input', required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入编码')],
        }
    },
    {
        label: `描述`, name: `desc`, col: 12, components: 'input', componentsProps: {
            type: "textarea"
        }
    },
    {label: `是否启用`, name: `status`, col: 12, defaultValue: true, components: 'toggle'},
]
export const dictionaryColumns: Column[] = [
    {
        name: 'label', label: '名称', align: 'left',
        edit: true,
        required:true,
        components: 'input',
        componentsProps: {
            validate: (val: string, err: any) => {
                if (!val) {
                    err.error = true
                    err.errorMessage = '请输入名称'
                    return false
                }
                err.error = false
                err.errorMessage = ''
                return true
            },
        },
    },
    {name: 'value', label: '编码',align: 'left',
        edit: true,
        required:true,
        components: 'input',
        componentsProps: {
            type:'number',
            validate: (val: number, err: any) => {
                if (!val) {
                    err.error = true
                    err.errorMessage = '请输入编码'
                    return false
                }
                err.error = false
                err.errorMessage = ''
                return true
            },
        },
    },
    {name: 'sort', label: '排序',align: 'left',defaultValue: 0,
        edit: true,
        components: 'input',
        componentsProps: {
            type:'number'
        },
    },
    {
        name: 'status', label: '是否启用',align: 'left',pt:'q-pt-none',
        edit: true,
        components: 'toggle',
        defaultValue: true,
        format: (val: any, row: any) => {
            return formatChip(row.status)
        },
    }
]
export const dictionarySearch: SearchColumn[] = [
    {label: 'test', name: 'test1', value: '', components: 'select'},
    {label: 'test2', name: 'test2', value: '', components: 'input'},
    {label: 'test4', name: 'test4', value: '', components: 'select'},
]

