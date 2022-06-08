<template>
    <div :style="height" class="flex column no-wrap q-pt-xs">
        <div class="col-auto flex column q-pa-xs q-gutter-y-xs">

            <div class="tools flex full-width items-center q-gutter-x-sm">

                <x-btn-group :btn-list="btnList"/>

                <q-separator v-if="btnList.length>0" vertical inset/>

                <div class="flex row q-gutter-x-xs justify-start items-center">
                    <q-btn color="primary" round dense flat icon="o_download" @click="loadData">
                        <q-tooltip>导出</q-tooltip>
                    </q-btn>
                    <q-btn color="primary" round dense flat icon="search">
                        <x-search-form @onSearch="onSearch" :search-list="searchList"/>
                        <q-tooltip>高级查询</q-tooltip>
                    </q-btn>
                    <q-btn color="primary" round dense flat icon="tune">
                        <x-field-setting/>
                        <q-tooltip>列设置</q-tooltip>
                    </q-btn>
                </div>

                <q-space/>

                <q-input class="col-3" rounded standout dense v-model="filter"
                         placeholder="请输入关键字">
                    <template #append>
                        <q-icon name="search"/>
                    </template>
                </q-input>
                <q-btn color="primary" round dense flat icon="refresh" @click="loadData">
                    <q-tooltip>刷新</q-tooltip>
                </q-btn>

            </div>

            <div class="full-width flex row q-gutter-x-xs">
            </div>

        </div>
        <q-table
            ref="tableRef"
            class="x-table col"
            v-bind="$attrs"

            @request="onRequest"
            v-model:pagination="pagination"

            :hide-pagination="hidePagination"
            :loading="loading"
            :rows="dataSource"
            :row-key="rowKey"
            :selection="selection"
            :rows-per-page-options="rowsPerPageOptions"
            :columns="newColumns"
            :visible-columns="visibleColumns"
        >
            <template #header="props">
                <q-tr :props="props">
                    <q-th auto-width>
                        <q-checkbox dense size="sm" v-model="props.selected"/>
                    </q-th>
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        class="text-weight-bold"
                    >
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>
            <template #body="props">
                <q-tr :props="props">
                    <q-td auto-width>
                        <q-checkbox dense size="sm" v-model="props.selected"/>
                    </q-td>
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :auto-width="col.autoWidth === true"
                    >
                        <slot :name="`td-${col.name}`" v-bind="{col,props}">
                            <div
                                v-if="edit === 'cell' && col?.edit === true"
                                class="flex justify-end items-center q-gutter-x-sm" style="width: fit-content"
                            >
                                {{ props.row[col.name] }}
                                <q-icon name="edit"/>
                                <q-popup-edit
                                    :validate="(val)=>col?.componentsProps.validate(val,col)"
                                    @hide="(val)=>col?.componentsProps.validate(val,col)"
                                    v-model="props.row[col.name]"
                                    buttons
                                    v-slot="scope"
                                >
                                    <x-field
                                        v-bind="col"
                                        v-model="scope.value"
                                    />
                                </q-popup-edit>
                            </div>
                            <div
                                v-else-if="edit === 'row' && col?.edit === true && props.row.edit === true"
                                class="flex justify-start items-center q-gutter-x-sm full-width"
                                :class="[col.pt||'q-pt-none']"
                            >
                                <x-field v-if="col?.componentsProps?.type === 'number'" class="full-width" v-bind="{...col,...props.row?.err?.[col.name],label:undefined}" v-model.number="props.row[col.name]"/>
                                <x-field v-else class="full-width" v-bind="{...col,...props.row?.err?.[col.name],label:undefined}" v-model="props.row[col.name]"/>
                            </div>
                            <div
                                v-else-if="edit === 'row' && col.name === 'editAction'"
                                :style="{textAlign:col.align||'center'}"
                            >
                                <q-btn v-if="props.row.edit !== true" @click="onEdit(props)" flat round dense
                                       color="orange" icon="o_edit">
                                    <q-tooltip>编辑当前行</q-tooltip>
                                </q-btn>
                                <q-btn v-if="props.row.edit !== true" @click="onCopy(props)" flat round dense
                                       color="primary" icon="content_copy">
                                    <q-tooltip>在下方复制一行</q-tooltip>
                                </q-btn>
                                <q-btn v-if="props.row.edit !== true" @click="onAdd(props)" flat round dense
                                       color="primary" icon="add">
                                    <q-tooltip>在下方新增一行</q-tooltip>
                                </q-btn>
                                <q-btn v-if="props.row.edit !== true" :loading="props.row.loading" @click="onDel(props)" flat round dense
                                       color="red" icon="remove">
                                    <q-tooltip>删除当前行</q-tooltip>
                                </q-btn>
                                <q-btn v-if="props.row.edit === true" :loading="props.row.loading" @click="onDone(props)" flat round dense
                                       color="primary" icon="o_done">
                                    <q-tooltip>保存</q-tooltip>
                                </q-btn>
                                <q-btn v-if="props.row.edit === true" @click="onCancel(props)" flat round dense
                                       color="red" icon="o_close">
                                    <q-tooltip>取消，数据将会被还原</q-tooltip>
                                </q-btn>
                            </div>
                            <div
                                v-else-if="isVue(col, props.row)"
                                :style="{textAlign:col.align||'center'}"
                            >
                                <component :is="formatLabel(col, props.row)"/>
                            </div>
                            <div
                                v-else
                                :style="{textAlign:col.align||'center'}"
                            >
                                {{ formatLabel(col, props.row) }}
                            </div>
                        </slot>
                    </q-td>
                </q-tr>
            </template>
            <template #loading>
                <q-inner-loading showing color="primary"/>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">

import {Btn} from "@/components/XBtnGroup";
import XBtnGroup from "@/components/XBtnGroup/index.vue";
import {computed, provide, ref} from "vue";
import {Column, ResultColumn, SearchColumn, XSearchForm} from "@/components/XTable/index";
import XFieldSetting from "@/components/XTable/XFieldSetting.vue";
import XField from "@/components/XForm/XField.vue";
import {getComponentsByName} from "@/components/XForm/index";
import {actionRef} from "@/tools/action/curd";
import {v4} from "uuid";
import {dialog, notify} from "@/hooks/message";
import {clone, isNumber} from "lodash-es";

interface XTableProps {
    api?: (search: any) => any,
    search?: any,
    addRowBoj?: any,
    resultKey?: string,
    height?: any,
    resultPage?: any,
    dataSource: any[],
    columns: Column[],
    btnList?: Btn[],
    searchList?: SearchColumn[],
    rowKey?: string,
    selection: 'multiple' | 'single',
    rowsPerPageOptions: number[],
    edit: 'cell' | 'row' | '',
    action: any,
    loadFirst?: boolean,
    hideSerialNumber?: boolean,
    hidePagination?: boolean,
    pageSize?: number,
}
const props = withDefaults(defineProps<XTableProps>(), {
    btnList: () => [],
    columns: () => [],
    searchList: () => [],
    dataSource: () => [],
    rowsPerPageOptions: () => [25, 50, 100, 300, 500, 1000],
    edit: '',
    action: null,
    search: null,
    addRowBoj: null,
    resultKey: 'list',
    rowKey: 'ID',
    selection: 'multiple',
    loadFirst: true,
    hidePagination: false,
    hideSerialNumber: false,
    pageSize: 25,
    resultPage: {
        page: 'page',
        rowsPerPage: 'pageSize',
        rowsNumber: 'total',
    },
})
const emit = defineEmits(['updateDone','updateDel'])

const {tableRef} = actionRef()

const filter = ref('')
const query = ref(props.search || {})
const loading = ref(false)
const fullscreen = ref(false)
const pagination = ref<any>({
    page: 1,
    rowsPerPage: 50,
})
const editData = ref<any>({})
const dataSource = ref<any[]>([])
const newColumns = ref<Column[]>(clone(props.columns))

const visibleColumns = computed(() => {
    const list = newColumns.value.filter((item:Column)=>item.show === true)
    return list.map(item=>item.name)
})

const isVue = (col: any, row: any) => {
    if (typeof col.format === 'function') {
        const comp = col.format(row[col.name], row)
        return typeof comp === 'object'
    }
    return false
}
const formatLabel = (col: any, row: any) => {
    if (typeof col.format === 'function') return col.format(row[col.name], row)
    return row[col.name]
}

const validate = (row: any, cols: any) => {
    cols.forEach((col: any) => {
        if (typeof col.componentsProps?.validate === 'function') {
            if (!row.err) row.err = {}
            const err:any = (row.err[col.name] = {})
            const result = col.componentsProps.validate(row[col.name], err)
            err?.errorMessage && notify.error(err?.errorMessage)
            if (!result) throw new Error(err?.errorMessage)
        }
    })
}
const loadData = async (params: any = {}) => {

    if (typeof props.api === 'function') {

        loading.value = true
        query.value = Object.assign(query.value, params)

        const result = await props.api(query.value)

        if (!props.hidePagination) {
            pagination.value.page = result[props.resultPage.page]
            pagination.value.rowsPerPage = result[props.resultPage.rowsPerPage]
            pagination.value.rowsNumber = result[props.resultPage.rowsNumber]
        }

        if (!props.hideSerialNumber) {
            dataSource.value = result[props.resultKey].filter((item: any, index: number) => {
                item.serialNumber = ((query.value.page - 1) * query.value.pageSize) + (index + 1)
                return item
            })
        } else {
            dataSource.value = result[props.resultKey]
        }

        loading.value = false
    } else {
        dataSource.value = props.dataSource
    }
}
const addFirst = (row:any={}) => {
    const newRow:any = Object.assign(row,props.addRowBoj)
    newRow.edit = true
    newRow.editType = 'add'
    newRow[props.rowKey] = v4()
    dataSource.value.unshift(Object.assign(newRow,row))
}

const onDel = ({row}: any) => {
    dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        emit('updateDel',row)
    }, () => {
    })
}
const onAdd = ({row}: any) => {
    const key = row[props.rowKey]
    const index = dataSource.value.findIndex(item=>item[props.rowKey] === key)
    const newRow:any = Object.assign({},props.addRowBoj)
    newRow.edit = true
    newRow.editType = 'add'
    newRow[props.rowKey] = v4()
    dataSource.value.splice(index+1,0,newRow)
}
const onCopy = ({row}: any) => {
    const key = row[props.rowKey]
    const index = dataSource.value.findIndex(item=>item[props.rowKey] === key)

    const newRow = Object.assign(clone(row),props.addRowBoj)
    newRow.edit = true
    newRow.editType = 'add'
    newRow[props.rowKey] = v4()
    dataSource.value.splice(index+1,0,newRow)
}
const onEdit = ({row}: any) => {
    const key = row[props.rowKey]
    row.edit = true
    row.editType = 'edit'
    editData.value[key] = JSON.parse(JSON.stringify(row))
}
const onDone = ({row, cols}: any) => {
    validate(row, cols)
    emit('updateDone',row)
}
const onCancel = ({row}: any) => {
    const key = row[props.rowKey]
    const editRow = editData.value[key]
    if (!editRow){
        const index = dataSource.value.findIndex(item=>item[props.rowKey] === key)
        dataSource.value.splice(index,1)
    }else {
        row = Object.assign(row, editData.value[key])
        row.edit = false
    }
}
const onSearch = (list: ResultColumn[]) => {
    console.log(list)
}
const onRequest = async (props: any) => {
    const {page, rowsPerPage, sortBy, descending} = props.pagination
    await loadData({page, pageSize: rowsPerPage, ...props.filter})
}

const init = () => {
    if (props.edit === 'row') {
        newColumns.value.push({
            align: 'center',
            name: 'editAction',
            label: '操作',
            field: 'editAction',
            autoWidth: true,
        })
    }
    if (!props.hideSerialNumber) {
        newColumns.value.unshift({
            align: 'center',
            name: 'serialNumber',
            label: '#',
            field: 'serialNumber',
            autoWidth: true,
        })
    }

    newColumns.value.forEach((item: any) => {
        const defaultComponentsProps = {
            dense: true,
            outlined: false,
            rounded: true,
            clearable: true,
            standout: '',
            hint:'',
        }
        if (!item.field) item.field = item.name
        item.show = item.show !== false
        if (typeof item.components === 'string') item.components = getComponentsByName(item.components || 'input')
        item.componentsProps = Object.assign(defaultComponentsProps,item.componentsProps)
    })

    if (!props.hidePagination) {
        query.value.page = 1
        query.value.pageSize = props.pageSize
    }

    if (props.loadFirst) loadData()
}
init()

provide('newColumns', newColumns)
defineExpose({loadData,addFirst})

</script>

<script lang="ts">
export default {
    name: "XTable",
};
</script>

<style scoped lang="sass">
.my-input
    height: 30px
    align-items: center

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
        //box-shadow: -6px 0 6px 0 rgb(0 0 0 / 5%)
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

</style>
