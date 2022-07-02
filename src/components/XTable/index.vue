<template>
    <div
        :style="{height}"
        class="flex column no-wrap"
    >
        <div class="col-auto flex column">
            <div class="tools relative-position q-pa-xs q-gutter-x-xs flex full-width items-center justify-start">
                <x-btn-group :btn-list="btnList" />

                <q-space />

                <q-btn
                    dense
                    flat
                    color="primary"
                    icon="r_download"
                    @click="loadData"
                >
                    <q-tooltip>导出</q-tooltip>
                </q-btn>
                <q-btn
                    dense
                    flat
                    color="primary"
                    icon="r_tune"
                >
                    <x-field-setting />
                    <q-tooltip>列设置</q-tooltip>
                </q-btn>
                <q-btn
                    dense
                    flat
                    color="primary"
                    icon="refresh"
                    @click="loadData"
                >
                    <q-tooltip>刷新</q-tooltip>
                </q-btn>
                <q-btn
                    color="primary"
                    flat
                    dense
                    icon="r_filter_list"
                    @click="showFilter = !showFilter"
                >
                    <q-tooltip>高级查询</q-tooltip>
                </q-btn>
                <div
                    v-show="showFilter"
                    style="position: absolute;z-index: 4;top: 41px;left: 0;"
                    class="filter layout-shadow-up full-width"
                >
                    <XFilterList :filter-list="filterList" />
                </div>
            </div>

            <q-separator />

            <div class="full-width relative-position q-pr-sm q-pl-sm flex row items-center q-gutter-x-xs input-search">
                <q-input
                    v-model="filter"
                    dense
                    borderless
                    placeholder="请输入关键字"
                >
                    <template #append>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-space />

                <q-btn
                    color="primary"
                    flat
                    dense
                    :icon="showSearch?'r_keyboard_double_arrow_down':'keyboard_double_arrow_up'"
                    @click="showSearch = !showSearch"
                >
                    <q-tooltip>更多查询</q-tooltip>
                </q-btn>
            </div>

            <div
                v-show="showSearch"
            >
                <q-separator />
                <div class="column">
                    <div class="row col q-pa-md justify-start q-gutter-md">
                        <x-form :fields="searchList" />

                        <div>
                            <q-btn
                                dense
                                flat
                                color="primary"
                                icon="r_search"
                                label="开始查询"
                            />
                            <q-btn
                                dense
                                flat
                                color="primary"
                                icon="r_restart_alt"
                                label="重置条件"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <q-table
            ref="tableRef"

            v-bind="$attrs"

            v-model:pagination="pagination"

            flat
            class="x-table col"

            :loading="loading"
            :hide-pagination="hidePagination"
            :separator="separator"
            :rows="dataSource"
            :row-key="rowKey"
            :selection="selection"
            :rows-per-page-options="rowsPerPageOptions"
            :columns="newColumns"
            :visible-columns="visibleColumns"
            :bordered="bordered"

            @request="onRequest"
        >
            <template #header="props">
                <q-tr :props="props">
                    <q-th auto-width>
                        <q-checkbox
                            v-model="props.selected"
                            dense
                            size="sm"
                        />
                    </q-th>
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        :style="{...getThStyle,minWidth:`${thWidth[col.name]}px`}"
                        class="text-weight-bold"
                    >
                        {{ col.label }}
                        <q-icon
                            v-if="col?.drag === true"
                            name="drag_indicator"
                            color="grey-8"
                            style="cursor: move;float: right"
                            size="1.5em"
                            @mousedown="()=>onMousedown(col)"
                        />
                    </q-th>
                </q-tr>
            </template>
            <template #body="props">
                <q-tr :props="props">
                    <q-td auto-width>
                        <q-checkbox
                            v-model="props.selected"
                            dense
                            size="sm"
                        />
                    </q-td>
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :auto-width="edit === 'row' && col.name === 'editAction'"
                    >
                        <slot
                            :name="`td-${col.name}`"
                            v-bind="{col,props}"
                        >
                            <div
                                v-if="edit === 'row' && col.name === 'editAction'"
                                class="flex no-wrap items-center justify-center q-gutter-x-sm"
                            >
                                <q-btn
                                    v-if="props.row.edit !== true && openEdit === false"
                                    flat
                                    round
                                    dense
                                    color="orange"
                                    icon="o_edit"
                                    @click="onEdit(props)"
                                >
                                    <q-tooltip>编辑当前行</q-tooltip>
                                </q-btn>
                                <q-btn
                                    v-if="props.row.edit !== true"
                                    flat
                                    round
                                    dense
                                    color="primary"
                                    icon="content_copy"
                                    @click="onCopy(props)"
                                >
                                    <q-tooltip>在下方复制一行</q-tooltip>
                                </q-btn>
                                <q-btn
                                    v-if="props.row.edit !== true"
                                    flat
                                    round
                                    dense
                                    color="primary"
                                    icon="add"
                                    @click="onAdd(props)"
                                >
                                    <q-tooltip>在下方新增一行</q-tooltip>
                                </q-btn>
                                <q-btn
                                    v-if="props.row.edit !== true"
                                    :loading="props.row.loading"
                                    flat
                                    round
                                    dense
                                    color="red"
                                    icon="remove"
                                    @click="onDel(props)"
                                >
                                    <q-tooltip>删除当前行</q-tooltip>
                                </q-btn>
                                <q-btn
                                    v-if="props.row.edit === true"
                                    :loading="props.row.loading"
                                    flat
                                    round
                                    dense
                                    color="primary"
                                    icon="o_done"
                                    @click="onDone(props)"
                                >
                                    <q-tooltip>保存</q-tooltip>
                                </q-btn>
                                <q-btn
                                    v-if="props.row.edit === true"
                                    flat
                                    round
                                    dense
                                    color="red"
                                    icon="o_close"
                                    @click="onCancel(props)"
                                >
                                    <q-tooltip>取消，数据将会被还原</q-tooltip>
                                </q-btn>
                            </div>
                            <div
                                v-else
                                :style="getTdStyle(col)"
                            >
                                <template v-if="edit === 'cell' && col?.edit === true">
                                    <q-icon name="edit" />
                                    <q-popup-edit
                                        v-slot="scope"
                                        v-model="props.row[col.name]"
                                        :validate="(val)=>col?.componentsProps.validate(val,col)"
                                        buttons
                                        @hide="(val)=>col?.componentsProps.validate(val,col)"
                                    >
                                        <x-field
                                            v-bind="col"
                                            v-model="scope.value"
                                        />
                                    </q-popup-edit>
                                </template>
                                <template
                                    v-else-if="edit === 'row' && col?.edit === true && (props.row.edit === true || openEdit === true)"
                                >
                                    <x-field
                                        v-if="col?.componentsProps?.type === 'number'"
                                        v-bind="{...col,...props.row?.err?.[col.name]}"
                                        v-model.number="props.row[col.name]"
                                        :label="undefined"
                                        class="full-width"
                                    />
                                    <x-field
                                        v-else
                                        v-bind="{...col,...props.row?.err?.[col.name]}"
                                        v-model="props.row[col.name]"
                                        :label="undefined"
                                        class="full-width"
                                    />
                                </template>
                                <template v-else-if="isVue(col, props.row)">
                                    <component :is="formatLabel(col, props.row)" />
                                </template>
                                <template v-else>
                                    {{ formatLabel(col, props.row) }}
                                </template>
                            </div>
                        </slot>
                    </q-td>
                </q-tr>
            </template>
            <template #loading>
                <q-inner-loading
                    showing
                    color="primary"
                />
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">

import {
    XBtnGroup,
    Column, ResultColumn, SearchColumn, BtnGroup, getComponentsByName, BaseFunctionReturn,
} from '@/components';
import {
    computed, provide, ref,
} from 'vue';
import XFieldSetting from '@/components/XTable/XFieldSetting.vue';
import XField from '@/components/XForm/XField.vue';
import { actionRef } from '@/tools/action/curd';
import { v4 } from 'uuid';
import { dialog, notify } from '@/hooks/message';
import { clone } from 'lodash-es';
import { BaseObj } from '@/types';
import XForm from '@/components/XForm/index.vue';
import XFilterList from '@/components/XTable/XFilterList.vue';

interface XTableProps {
    api?: (search: any) => any,
    afterFormat?: BaseFunctionReturn,
    apiAfterFormat?: BaseFunctionReturn,
    search?: any,
    addRowBoj?: any,
    resultKey?: string,
    height?: any,
    resultPage?: any,
    dataSource?: any[],
    columns: Column[],
    btnList?: BtnGroup[],
    searchList?: SearchColumn[],
    filterList?: SearchColumn[],
    rowKey?: string,
    selection?: 'multiple' | 'single',
    separator?: 'cell' | 'none' | 'horizontal' | 'vertical',
    rowsPerPageOptions?: number[],
    edit?: 'cell' | 'row' | '',
    action?: any,
    bordered?: boolean,
    loadFirst?: boolean,
    hideTools?: boolean,
    hideSerialNumber?: boolean,
    hidePagination?: boolean,
    openEdit?: boolean,
    pageSize?: number,
}
const props = withDefaults(defineProps<XTableProps>(), {
    api: undefined,
    afterFormat: undefined,
    apiAfterFormat: undefined,
    height: undefined,
    btnList: () => [],
    columns: () => [],
    searchList: () => [],
    filterList: () => [],
    dataSource: () => [],
    rowsPerPageOptions: () => [25, 50, 100, 300, 500, 1000],
    edit: '',
    action: null,
    search: null,
    addRowBoj: null,
    resultKey: 'list',
    rowKey: 'ID',
    selection: 'multiple',
    separator: 'horizontal',
    bordered: false,
    loadFirst: true,
    hideTools: false,
    hidePagination: false,
    hideSerialNumber: false,
    openEdit: false,
    pageSize: 25,
    resultPage: {
        page: 'page',
        rowsPerPage: 'pageSize',
        rowsNumber: 'total',
    },
});
const emit = defineEmits(['updateDone', 'updateDel']);

const { tableRef } = actionRef();

const filter = ref('');
const query = ref(props.search || {});
const loading = ref(false);
const showFilter = ref(false);
const showSearch = ref(false);

const pagination = ref<any>({
    page: 1,
    rowsPerPage: 50,
});
const editData = ref<any>({});
const dataSource = ref<any[]>([]);
const newColumns = ref<Column[]>(clone(props.columns));
const thWidth = ref<BaseObj>({});

const getThStyle = computed(() => (col:Column):string => {
    const style:any = { textAlign: col.align };
    if (col.width) style.minWidth = col.width;
    return style;
});
const getTdStyle = computed(() => (col:Column):any => {
    const style:any = { textAlign: col.align };
    if (col.width) style.minWidth = col.width;

    return style;
});
const visibleColumns = computed(() => {
    const list = newColumns.value.filter((item:Column) => item.show === true);
    return list.map((item) => item.name);
});

const isVue = (col: any, row: any) => {
    if (typeof col.format === 'function') {
        const comp = col.format(row[col.name], row);
        return typeof comp === 'object';
    }
    return false;
};
const formatLabel = (col: any, row: any) => {
    if (typeof col.format === 'function') return col.format(row[col.name], row);
    return row[col.name];
};

const validate = (row: any, cols: any) => {
    cols.forEach((col: any) => {
        if (typeof col.componentsProps?.validate === 'function') {
            if (!row.err) row.err = {};
            row.err[col.name] = {};
            const err:any = row.err[col.name];
            const result = col.componentsProps.validate(row[col.name], err);
            if (err?.errorMessage) notify.error(err?.errorMessage);
            if (!result) throw new Error(err?.errorMessage);
        }
    });
};
const loadData = async (params: any = {}) => {
    let list: any[];
    if (typeof props.api === 'function') {
        loading.value = true;
        query.value = Object.assign(query.value, params);

        const result = await props.api(query.value);

        if (!props.hidePagination) {
            pagination.value.page = result[props.resultPage.page];
            pagination.value.rowsPerPage = result[props.resultPage.rowsPerPage];
            pagination.value.rowsNumber = result[props.resultPage.rowsNumber];
        }

        if (typeof props.apiAfterFormat === 'function') {
            list = props.apiAfterFormat(result);
        } else {
            list = result[props.resultKey];
        }

        loading.value = false;
    } else {
        list = props.dataSource;
    }

    dataSource.value = afterFormat(list);
};
const clearData = () => {
    dataSource.value = [];
};
const getDataSource = () => dataSource.value;

const afterFormat = (list:any[]) => {
    let newList:any[] = list;
    if (typeof props.afterFormat === 'function') {
        newList = props.afterFormat(newList);
    }

    if (!props.hideSerialNumber) {
        newList = newList.filter((item: any, index: number) => {
            if (props.hidePagination) {
                item.serialNumber = (index + 1);
            } else {
                item.serialNumber = ((query.value.page - 1) * query.value.pageSize)
                    + (index + 1);
            }
            return item;
        });
    }

    return newList;
};

const addRow = (row:any = {}) => {
    const newRow:any = Object.assign(row, props.addRowBoj);
    newRow.edit = true;
    newRow.editType = 'add';
    newRow[props.rowKey] = v4();
    dataSource.value.unshift(Object.assign(newRow, row));
};
const delRowByKey = (key:any) => {
    const index = dataSource.value.findIndex((item) => item[props.rowKey] === key);
    dataSource.value.splice(index, 1);
};

const onDel = ({ row }: any) => {
    dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        emit('updateDel', row);
    }, () => {
    });
};
const onAdd = ({ row }: any) => {
    const key = row[props.rowKey];
    const index = dataSource.value.findIndex((item) => item[props.rowKey] === key);
    const newRow:any = { ...props.addRowBoj };
    newRow.edit = true;
    newRow.editType = 'add';
    newRow[props.rowKey] = v4();
    dataSource.value.splice(index + 1, 0, newRow);
};
const onCopy = ({ row }: any) => {
    const key = row[props.rowKey];
    const index = dataSource.value.findIndex((item) => item[props.rowKey] === key);

    const newRow = Object.assign(clone(row), props.addRowBoj);
    newRow.edit = true;
    newRow.editType = 'add';
    newRow[props.rowKey] = v4();
    dataSource.value.splice(index + 1, 0, newRow);
};
const onEdit = ({ row }: any) => {
    const key = row[props.rowKey];
    row.edit = true;
    row.editType = 'edit';
    editData.value[key] = JSON.parse(JSON.stringify(row));
};
const onDone = ({ row, cols }: any) => {
    validate(row, cols);
    emit('updateDone', row);
};
const onCancel = ({ row }: any) => {
    const key = row[props.rowKey];
    const editRow = editData.value[key];
    if (!editRow) {
        const index = dataSource.value.findIndex((item) => item[props.rowKey] === key);
        dataSource.value.splice(index, 1);
    } else {
        // eslint-disable-next-line no-param-reassign
        row = Object.assign(row, editData.value[key]);
        row.edit = false;
    }
};
const onSearch = (list: ResultColumn[]) => {
    console.log(list);
};
const onRequest = async (props: any) => {
    const {
        page, rowsPerPage, sortBy, descending,
    } = props.pagination;
    await loadData({ page, pageSize: rowsPerPage, ...props.filter });
};

const onMousedown = (col:Column) => {
    const onMouseMove = (event:any) => {
        thWidth.value[col.name] += (event?.movementX || 0);
    };
    const onMouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseup);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseup);
};

const init = () => {
    if (props.edit === 'row') {
        newColumns.value.push({
            align: 'center',
            name: 'editAction',
            label: '操作',
            field: 'editAction',
            autoWidth: true,
        });
    }
    if (!props.hideSerialNumber) {
        newColumns.value.unshift({
            align: 'center',
            name: 'serialNumber',
            label: '#',
            field: 'serialNumber',
            autoWidth: true,
        });
    }

    newColumns.value.forEach((item: any) => {
        const defaultComponentsProps = {
            dense: true,
            outlined: false,
            clearable: true,
            standout: '',
            hint: '',
        };
        if (!item.align) item.align = 'left';
        if (!item.field) item.field = item.name;
        item.show = item.show !== false;
        thWidth.value[item.name] = item.width;
        if (typeof item.components === 'string') item.components = getComponentsByName(item.components || 'input');
        item.componentsProps = Object.assign(defaultComponentsProps, item.componentsProps);
    });

    if (!props.hidePagination) {
        query.value.page = 1;
        query.value.pageSize = props.pageSize;
    }

    if (props.loadFirst) loadData();
};
init();

provide('newColumns', newColumns);
defineExpose({
    loadData, clearData, addRow, delRowByKey, getDataSource,
});

</script>

<script lang="ts">
export default {
    name: 'XTable',
};
</script>

<style scoped lang="sass">
.x-table
    width: 100%

    ::v-deep(.q-field__bottom)
        display: none
    ::v-deep(.q-field--with-bottom)
        padding-bottom: 0

    tr th
        position: sticky
        z-index: 2

    thead tr:last-child th
        top: 48px
        z-index: 3

    thead tr:first-child th
        top: 0
        z-index: 1

    tr:first-child th:first-child
        z-index: 3

    tr:last-child th:last-child
        z-index: 3

    td:first-child
        z-index: 1

    td:last-child
        z-index: 1

    td:first-child, th:first-child
        position: sticky
        left: 0
        //box-shadow: 6px 0 6px 0 rgb(0 0 0 / 5%)
        background: white

    td:last-child, th:last-child
        position: sticky
        right: 0
        box-shadow: -5px 0 6px 0 rgb(0 0 0 / 5%)
        background: white

.body--light
    .tools
        background: white

    .search
        background: $grey-1

    .x-table
        td:first-child
            background-color: white !important

        tr th
            position: sticky
            z-index: 2
            background: $grey-11

    .filter
        background: white

.body--dark
    .tools
        background: $dark

    .x-table
        td:first-child
            background-color: $dark !important

        td:last-child
            background-color: $dark !important

        tr th
            background: $grey-10

    .filter
        background: $grey-10

</style>
