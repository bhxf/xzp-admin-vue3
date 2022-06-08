import {h} from "vue";
import {QChip, QIcon} from "quasar";

export const formatChip = (value: boolean) => {
    const text = value ? '是' : '否'
    const color = value ? 'primary' : 'red'
    return h(QChip, {color, outline: true, size: 'sm'}, text)
}
export const formatIcon = (value: string) => {
    return h(QIcon, {name: value, size: 'sm',color:'grey-8'})
}
