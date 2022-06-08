import {getMenuList} from "@/api/system/menu";
import {formatChip, formatIcon} from "@/tools/format";

const formatLabel = (node: any) => {
    return node.meta?.title
}
export const menuForm = [
    {
        label: `父级`, name: `parentId`, col: 12, components: 'inputTree',
        componentsProps: {
            api: getMenuList,
            resultKey: 'list',
            nodeKey: 'ID',
            format:formatLabel,
            // tickStrategy: "leaf",
            // multiple: true,
        },
        updateFieldValue: ({}) => {
        }
    },
    {
        label: `名称`, name: `title`, col: 6, components: 'input', required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入名称')],
        }
    },
    {label: `图标`, name: `icon`, col: 6, components: 'icon'},
    {
        label: `组件名称`, name: `name`, col: 6, components: 'input', required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入组件名称')],
        }
    },
    {label: `排序`, name: `sort`, col: 6, components: 'input', defaultValue: 0, componentsProps: {type: 'number'}},
    {
        label: `路由地址`, name: `path`, col: 12, components: 'input', required: true, defaultValue: '/',
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入路由地址')],
        }
    },
    {
        label: `组件地址`, name: `component`, col: 12, components: 'input', required: true, defaultValue: '/',
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入组件地址')],
        }
    },
    {label: `是否缓存`, name: `keepAlive`, col: 3, components: 'checkbox', defaultValue: false},
    {label: `是否关闭`, name: `closeTab`, col: 3, components: 'checkbox', defaultValue: false},
]
export const menuColumns = [
    {
        name: 'name',
        required: true,
        label: '菜单名称',
        align: 'left',
        field: 'title',
        format: (val: any, row: any) => {
            return row.meta.title
        },
        sortable: true
    },
    {name: 'icon', label: '图标', field: 'icon',
        format: (val: any, row: any) => {
            return formatIcon(row.meta.icon)
        },
    },
    {name: 'path', label: '路由地址', field: 'path'},
    {name: 'component', label: '组件地址', field: 'component'},
    {name: 'name', label: '组件名称', field: 'name'},
    {name: 'icon', label: '排序', field: 'icon'},
    {name: 'keepAlive', label: '是否缓存', field: 'keepAlive',
        format: (val: any, row: any) => {
            return formatChip(row.meta.keepAlive)
        },
    },
    {name: 'closeTab', label: '是否关闭', field: 'closeTab',
        format: (val: any, row: any) => {
            return formatChip(row.meta.closeTab)
        },
    },
    {
        name: 'carbs', label: 'Carbs (g)', field: 'carbs',
        style: 'width: 150px',
        edit: true,
        components: 'input',
        componentsProps: {
            hint: 'The value must',
            validate: (val: string, err:any)=> {
                if (val.length < 4) {
                    err.error = true
                    err.errorMessage = 'The value must be between 4 and 7!'
                    return false
                }
                err.error = false
                err.errorMessage = ''
                return true
            },
            error: false,
            errorMessage: '',
        },
        required: true,
    },
]

