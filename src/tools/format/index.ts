import { h } from 'vue';
import { QBtn, QChip, QIcon } from 'quasar';

export const formatLinkBtn = (value:any) => h(QBtn, {
    rounded: true, flat: true, color: 'primary', size: 'xs', dense: true,
}, value);
export const formatChip = (value:any, yes:any = true) => {
    const text = value === yes ? '是' : '否';
    const color = value === yes ? 'primary' : 'red';
    return h(QChip, {
        color, outline: true, size: 'sm', label: text,
    });
};
export const formatIcon = (value: string) => h(QIcon, { name: value, size: 'sm' });
