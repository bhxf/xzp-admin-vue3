import XForm from '@/components/XForm/index.vue';
import {
    QForm,

    QBtnToggle,
    QCheckbox,
    QDate,
    QInput,
    QOptionGroup,
    QRadio,
    QRange,
    QSelect,
    QTime,
    QToggle, QTree,
} from 'quasar';
import XBtnGroup from '@/components/XBtnGroup/index.vue';
import XField from '@/components/XForm/XField.vue';
import XFormArea from '@/components/XFormArea/index.vue';
import XTable from '@/components/XTable/index.vue';
import XSearchForm from '@/components/XTable/XSearchForm.vue';
import XTree from '@/components/XTree/index.vue';
import XIcon from '@/components/XIcon/index.vue';
import XInputTree from '@/components/XTree/XInputTree.vue';

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

export interface BaseFunction {
  // eslint-disable-next-line no-unused-vars
  (params?: any):void;
}
export interface BaseFunctionReturn {
  // eslint-disable-next-line no-unused-vars
  (params?: any):any;
}
export interface ChangeCallback {
  // eslint-disable-next-line no-unused-vars
  (getObj: BaseFunction, updateObj: BaseFunction, updateObjConfig: BaseFunction):void
}
export interface SortFunction {
  // eslint-disable-next-line no-unused-vars
  (a: any, b: any, rowA: any, rowB: any):number
}
export interface FormatFunction {
  // eslint-disable-next-line no-unused-vars
  (val: any, row: any):any
}
export interface ListRef {
  loadData: BaseFunction
}
export interface TreeRef {
  loadData: BaseFunction,
  updateTicked: BaseFunction,
  treeRef:QTree
}
export interface TableRef {
  loadData: BaseFunction,
  addRow: BaseFunction,
  delRowByKey: BaseFunction,
  setFullscreen: () => void,
  exitFullscreen: () => void,
}
export interface DetailRef{
  loadData:BaseFunction
}
export interface FormAreaRef{
  updateAreaLoading:BaseFunction
}

export interface BtnGroup{
  icon?: string,
  key: string,
  color?: string,
  tooltip?: string,
  isDisable?: () => boolean,
  onClick:BaseFunction
}
export interface FormRef {
  getFormRef: QForm,
  formInfo: any,
  updateObj: BaseFunction
  clear: () => void
}
export interface FormArea{
  label:string,
  name:string,
  icon?:string
}
export interface SearchColumn {
  label:string,
  name:string,
  value:any,
  components?:ComponentsType,
  componentsProps?:any,
}
export interface Column {
  name: string,
  label: string,
  field?: string | BaseFunction,
  required?: boolean,
  defaultValue?: any,
  autoWidth?: boolean,
  show?: boolean,
  pt?: string,
  align?: 'left' | 'right' | 'center',
  sortable?: boolean,
  sort?: SortFunction,
  sortOrder?: 'ad' | 'da',
  format?: FormatFunction,
  style?: string | BaseFunction,
  width?: number,
  classes?: string | BaseFunction,
  headerStyle?: string,
  headerClasses?: string,
  edit?:boolean,
  editFormat?:BaseFunction,
  components?:ComponentsType,
  componentsProps?:any,
}
export interface ResultColumn {
  name:any,
  value:any,
  type:any,
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
  changeCallback?: ChangeCallback
}
export interface ValidateError {
  error:boolean,
  errorMessage:string
}

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
};
const getComponentsByName = (name: string) => componentsType[name || 'input'];
export {
    XBtnGroup,
    XForm,
    XField,
    XFormArea,
    XTable,
    XSearchForm,
    XTree,
    XInputTree,

    getComponentsByName,
};
