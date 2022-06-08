import XForm from "@/components/XForm/index.vue";
import {
    QBtnToggle,
    QCheckbox,
    QDate,
    QForm,
    QInput,
    QOptionGroup,
    QRadio,
    QRange,
    QSelect,
    QTime,
    QToggle
} from "quasar";
import {XInputTree} from "@/components/XTree";
import XIcon from "@/components/XIcon/index.vue";

export {
    XForm
}

export interface FormRef {
    getFormRef: QForm,
    formInfo: any,
    updateObj: (data: any) => void
    clear: () => void
}

export interface Field {
    label: string,
    name: string,
    col?: number,
    required?: boolean,
    hidden?: boolean,
    defaultValue?: any,
    components?: ComponentsType,
    componentsProps?: any,
    changeCallback?: (
        obj: {
            getObj?: () => any,
            updateObj?: (info: any) => void,
            updateObjConfig?: (fields: any) => void
        }) => void
}

export type ComponentsType =
    'input' |
    'inputTree' |
    'icon' |
    'select' |
    'radio' |
    'checkbox' |
    'toggle' |
    'btnToggle' |
    'optionGroup' |
    'range' |
    'time' |
    'date' |

    '' |
    null

const componentsType: any = {
    input: QInput,
    icon: XIcon,
    inputTree: XInputTree,
    select: QSelect,
    radio: QRadio,
    checkbox: QCheckbox,
    toggle: QToggle,
    btnToggle: QBtnToggle,
    optionGroup: QOptionGroup,
    range: QRange,
    time: QTime,
    date: QDate,
}

export const getComponentsByName = (name: string) => {
    return componentsType[name || 'input']
}
