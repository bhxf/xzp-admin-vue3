import { DictionaryEnum, getDictionaryById } from '@/tools/dictionary';
import { Column } from '@/components';

export const apiColumns:Column[] = [
  {
    name: 'ID',
    label: 'ID',
    show: false,
  },
  {
    name: 'apiGroup',
    label: '分组',
    align: 'left',
    style: 'width:100px',
    edit: true,
    required: true,
    components: 'input',
    componentsProps: {
      validate: (val: string, err:any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入分组';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'path',
    label: '路径',
    align: 'left',
    style: 'width:100px',
    edit: true,
    required: true,
    components: 'input',
    componentsProps: {
      validate: (val: string, err:any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入路径';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'method',
    label: '方法',
    align: 'left',
    style: 'width:100px',
    edit: true,
    required: true,
    components: 'select',
    componentsProps: {
      options: getDictionaryById(DictionaryEnum.API_METHOD_TYPE)
        .map((item:any) => ({ label: item.label, value: item.label })),
      validate: (val: string, err:any) => {
        if (!val) {
          err.error = true;
          err.errorMessage = '请输入方法';
          return false;
        }
        err.error = false;
        err.errorMessage = '';
        return true;
      },
    },
  },
  {
    name: 'description',
    label: '描述',
    align: 'left',
    edit: true,
    components: 'input',
    componentsProps: {
    },
  },
];
export const searchColumns:Column[] = [];
