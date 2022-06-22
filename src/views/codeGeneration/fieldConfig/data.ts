import {
    formatChip,
} from '@/tools/format';
import { Column, ValidateError } from '@/components';

const validateName = (val: number, err: ValidateError) => {
    if (!val) {
        err.error = true;
        err.errorMessage = '请输入菜单名称';
        return false;
    }
    err.error = false;
    err.errorMessage = '';
    return true;
};

export const fieldConfigColumns:Column[] = [
    { name: 'dataLen', label: '字段长度', show: false },
    { name: 'dataType', label: '数据类型', show: false },
    {
        name: 'dataPrimary', label: '是否主键', format: (value) => formatChip(value, 'PRI'), show: false,
    },
    {
        name: 'dataRequired', label: '是否必填', format: (value) => formatChip(value, 'YES'), show: false,
    },
    {
        name: 'dataField',
        label: '字段名称',
        width: 180,
        edit: true,
        required: true,
        components: 'input',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'dataDes',
        label: '字段描述',
        width: 200,
        edit: true,
        required: true,
        components: 'input',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'goField',
        label: 'go字段',
        width: 180,
        edit: true,
        required: true,
        components: 'input',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'goType',
        label: 'go类型',
        width: 180,
        edit: true,
        required: true,
        components: 'select',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'formField',
        label: '表单字段',
        width: 180,
        edit: true,
        required: true,
        components: 'input',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'formType',
        label: '表单类型',
        width: 180,
        edit: true,
        required: true,
        components: 'select',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'formRequired',
        label: '表单是否必填',
        width: 100,
        edit: true,
        required: true,
        components: 'toggle',
        componentsProps: {
            validate: validateName,
        },
        format: (value) => formatChip(value),
    },
    {
        name: 'formShow',
        label: '表单是否显示',
        width: 100,
        edit: true,
        required: true,
        components: 'toggle',
        componentsProps: {
            validate: validateName,
        },
        format: (value) => formatChip(value),
    },
    {
        name: 'goToJsonName',
        label: '列表字段',
        width: 180,
        edit: true,
        required: true,
        components: 'input',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'listType',
        label: '列表类型',
        width: 180,
        edit: true,
        required: true,
        components: 'select',
        componentsProps: {
            validate: validateName,
        },
    },
    {
        name: 'listShow',
        label: '列表是否显示',
        width: 100,
        edit: true,
        required: true,
        components: 'toggle',
        componentsProps: {
            validate: validateName,
        },
        format: (value) => formatChip(value),
    },
];
