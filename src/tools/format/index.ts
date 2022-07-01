import { h } from 'vue';
import { QChip, QIcon } from 'quasar';

export const formatChip = (value:any, yes:any = true) => {
    const text = value === yes ? '是' : '否';
    const color = value === yes ? 'primary' : 'red';
    return h(QChip, {
        color, outline: true, size: 'sm', label: text,
    });
};
export const formatIcon = (value: string) => h(QIcon, { name: value, size: 'sm' });

const firstUpperCase = (str:string) => str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
export const humpUpper = (str:string, replace:string):string => {
    if (!str) return str;
    const array:string[] = str.split(replace);
    let newStr = '';
    array.forEach((item:string) => {
        newStr += firstUpperCase(item);
    });
    return newStr;
};
export const humpLower = (str:string, replace:string):string => {
    if (!str) return str;
    const array:string[] = str.split(replace);
    let newStr = '';
    array.forEach((item:string, index) => {
        if (index > 0) {
            newStr += firstUpperCase(item);
        } else {
            newStr += item;
        }
    });

    return newStr;
};
export const toBoolByStr = (str:any, yes:any) => str === yes;
