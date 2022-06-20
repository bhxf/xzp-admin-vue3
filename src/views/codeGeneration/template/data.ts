import { Field } from '@/components';

export const templateForm:Field[] = [
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
];
