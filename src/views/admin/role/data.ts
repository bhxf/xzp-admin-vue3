import {getAuthorityList} from "@/api/system/role";
import {Field} from "@/components/XForm/index";

export const roleFormAreas:Field[] = [
    {
        label: `父级`, name: `parentId`, col: 4, components: 'inputTree',
        componentsProps: {
            api: getAuthorityList,
            resultKey: 'list',
            nodeKey: 'authorityId',
            labelKey: 'authorityName',
        },
    },
    {
        label: `角色ID`, name: `authorityId`, col: 4, components: 'input', required: true,
        componentsProps: {
            disable:true,
            type:'number',
            rules: [(val: any) => (val && val.length > 0) || ('请输入角色ID')],
        }
    },
    {
        label: `角色名称`, name: `authorityName`, col: 4, components: 'input', required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入角色名称')],
        }
    },
]
export const roleForm:Field[] = [
    {
        label: `父级`, name: `parentId`, col: 12, components: 'inputTree',
        componentsProps: {
            api: getAuthorityList,
            resultKey: 'list',
            nodeKey: 'authorityId',
            labelKey: 'authorityName',
        }
    },
    {
        label: `角色ID`, name: `authorityId`, col: 12, components: 'input', required: true,
        componentsProps: {
            type:'number',
            rules: [(val: any) => (val && val.length > 0) || ('请输入角色ID')],
        }
    },
    {
        label: `角色名称`, name: `authorityName`, col: 12, components: 'input', required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入角色名称')],
        }
    },
]

