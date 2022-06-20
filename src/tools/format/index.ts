import { h } from 'vue';
import { QBtn, QChip, QIcon } from 'quasar';

export const formatLinkBtn = (value:any) => h(QBtn, {
    rounded: true, flat: true, color: 'primary', size: 'xs', dense: true,
}, value);
export const formatChip = (value: boolean) => {
    const text = value ? '是' : '否';
    const color = value ? 'primary' : 'red';
    return h(QChip, {
        color, outline: true, size: 'sm', label: text,
    });
};
export const formatIcon = (value: string) => h(QIcon, { name: value, size: 'sm', color: 'primary' });
