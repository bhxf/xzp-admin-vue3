import { getMenuList } from '@/api/system/menu';
import { formatChip, formatIcon } from '@/tools/format';
import { Column } from '@/components';

const formatLabel = (node: any) => node.meta?.title;
export const menuForm = [
  {
    label: '父级',
    name: 'parentId',
    col: 12,
    components: 'inputTree',
    componentsProps: {
      api: getMenuList,
      resultKey: 'list',
      nodeKey: 'ID',
      format: formatLabel,
    },
  },
  {
    label: '名称',
    name: 'title',
    col: 6,
    components: 'input',
    required: true,
    componentsProps: {
      rules: [(val: any) => (val && val.length > 0) || ('请输入名称')],
    },
  },
  {
    label: '图标', name: 'icon', col: 6, components: 'icon',
  },
  {
    label: '组件名称',
    name: 'name',
    col: 6,
    components: 'input',
    required: true,
    componentsProps: {
      rules: [(val: any) => (val && val.length > 0) || ('请输入组件名称')],
    },
  },
  {
    label: '排序', name: 'sort', col: 6, components: 'input', defaultValue: 0, componentsProps: { type: 'number' },
  },
  {
    label: '路由地址',
    name: 'path',
    col: 12,
    components: 'input',
    required: true,
    defaultValue: '/',
    componentsProps: {
      rules: [(val: any) => (val && val.length > 0) || ('请输入路由地址')],
    },
  },
  {
    label: '组件地址',
    name: 'component',
    col: 12,
    components: 'input',
    required: true,
    defaultValue: '/',
    componentsProps: {
      rules: [(val: any) => (val && val.length > 0) || ('请输入组件地址')],
    },
  },
  {
    label: '是否缓存', name: 'keepAlive', col: 3, components: 'checkbox', defaultValue: true,
  },
  {
    label: '是否关闭', name: 'collect', col: 3, components: 'checkbox', defaultValue: true,
  },
  {
    label: '开启关闭操作', name: 'closeTab', col: 3, components: 'checkbox', defaultValue: true,
  },
];
export const menuColumns:Column[] = [
  {
    name: 'title',
    label: '菜单名称',
    style: 'width:200px',
    format: (val: any, row: any) => row.meta.title,
    sortable: true,
    edit: true,
    required: true,
    components: 'input',
    componentsProps: {
      validate: (val: number, err: any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入菜单名称';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'icon',
    label: '图标',
    style: 'width:100px',
    format: (val: any, row: any) => formatIcon(row.meta.icon),
    edit: true,
    components: 'icon',
  },
  {
    name: 'path',
    label: '路由地址',
    style: 'width:100px',
    required: true,
    edit: true,
    components: 'input',
    componentsProps: {
      validate: (val: number, err: any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入路由地址';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'component',
    label: '组件地址',
    style: 'width:100px',
    required: true,
    edit: true,
    components: 'input',
    componentsProps: {
      validate: (val: number, err: any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入组件地址';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'name',
    label: '组件名称',
    style: 'width:100px',
    edit: true,
    required: true,
    components: 'input',
    componentsProps: {
      validate: (val: number, err: any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入组件名称';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'sort',
    label: '排序',
    style: 'width:80px',
    edit: true,
    defaultValue: 0,
    components: 'input',
    componentsProps: {
      type: 'number',
    },
  },
  {
    name: 'keepAlive',
    label: '是否缓存',
    style: 'width:50px',
    format: (val: any, row: any) => formatChip(row.meta.keepAlive),
    required: true,
    edit: true,
    defaultValue: true,
    components: 'checkbox',
  },
  {
    name: 'collect',
    label: '是否收藏',
    style: 'width:50px',
    format: (val: any, row: any) => formatChip(row.meta.closeTab),
    required: true,
    edit: true,
    defaultValue: true,
    components: 'checkbox',
  },
  {
    name: 'closeTab',
    label: '是否关闭',
    style: 'width:50px',
    format: (val: any, row: any) => formatChip(row.meta.closeTab),
    required: true,
    edit: true,
    defaultValue: true,
    components: 'checkbox',
  },
];
