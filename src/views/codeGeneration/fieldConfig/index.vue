<template>
    <default-content>
        <template #default="prop">
            <q-splitter
                v-model="splitterModel"
                unit="px"
            >
                <template #before>
                    <div
                        class="flex column"
                        :style="{height:prop.pageHeight}"
                    >
                        <x-tree
                            v-if="treeData.length>0"
                            ref="treeRef"

                            :data-source="treeData"

                            @lazy-load="onLazyLoad"

                            @update:selected="updateSelected"
                            @update:ticked="updateTicked"
                        />
                    </div>
                </template>

                <template #after>
                    <x-table
                        ref="tableRef"
                        v-model:selected="tableSelected"

                        :load-first="false"
                        :hide-tools="true"
                        :hide-pagination="true"
                        :open-edit="true"

                        :height="prop.pageHeight"
                        :columns="fieldConfigColumns"

                        :search="search"
                        :btn-list="btnList"
                        :api="getColumn"
                        :add-row-boj="{keepAlive: true,closeTab:true ,collect: true,sort:0}"

                        edit="row"
                        row-key="name"

                        :api-after-format="apiAfterFormat"

                        @update-done="updateDone"
                        @update-del="updateDel"
                    />
                </template>
            </q-splitter>
        </template>
    </default-content>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import XTable from '@/components/XTable/index.vue';
import XTree from '@/components/XTree/index.vue';
import { notify } from '@/hooks/message';
import {
    actionConst, actionLoading, actionRef,
} from '@/tools/action/curd';
import { BaseObj } from '@/types';
import {
    getColumn, getDB, getTables, updateFieldConfig,
} from '@/api/codeGeneration/field';
import { fieldConfigColumns } from '@/views/codeGeneration/fieldConfig/data';
import { QTreeNode } from 'quasar';
import DefaultContent from '@/layouts/content/DefaultContent.vue';
import { BtnGroup } from '@/components';

const btnList:BtnGroup[] = [
    {
        label: '保存配置',
        flat: false,
        isLoading: () => loadings.value.save,
        isDisable: () => nodeInfo.value?.type !== 'table',
        onClick: () => saveFieldConfig(),
    },
    {
        label: '重置配置',
        flat: false,
        isLoading: () => loadings.value.save,
        isDisable: () => nodeInfo.value?.type !== 'table',
        onClick: () => resetFieldConfig(),
    },
    {
        icon: 'o_add',
        isDisable: () => nodeInfo.value?.type !== 'table',
        tooltip: '新增一行',
        onClick: () => tableRef.value?.addRow(),
    },
];
const treeData = ref([]);
const nodeInfo = ref();
const { tableRef, treeRef } = actionRef();
const {
    search, tableSelected, treeSelected, treeTicked,
} = actionConst();
const { loadings } = actionLoading('save');

const loadTreeData = async () => {
    const { dbs } = await getDB();
    treeData.value = dbs.map((item:any) => ({
        lazy: true, type: 'database', label: item.database, ID: item.database, icon: 'r_equalizer',
    }));
};
const onLazyLoad = async ({
    node, done,
}:QTreeNode) => {
    const { tables } = await getTables(node.ID);
    done(tables.map((item:any) => ({
        type: 'table', label: item.tableName, ID: item.tableName, dbName: node.ID, icon: 'r_table_view',
    })));
};

const saveFieldConfig = async () => {
    loadings.value.save = true;
    try {
        const list = tableRef.value?.getDataSource();
        await updateFieldConfig({
            tablesName: nodeInfo.value?.label,
            dbName: nodeInfo.value?.dbName,
            fieldsConfig: JSON.stringify(list),
        });
        notify.success('保存配置成功');
    } finally {
        loadings.value.save = false;
    }
};
const resetFieldConfig = async () => {
    loadings.value.save = true;
    try {
        await updateFieldConfig({
            tablesName: nodeInfo.value?.label,
            dbName: nodeInfo.value?.dbName,
            fieldsConfig: '[]',
        });
        notify.success('重置配置成功');
    } finally {
        loadings.value.save = false;
    }
};
const updateSelected = (value: any) => {
    treeSelected.value = value;
    const node = treeRef?.value?.treeRef.getNodeByKey(value);
    nodeInfo.value = node;
    if (node?.type === 'table') {
        tableRef.value?.loadData({ dbName: node.dbName, tableName: node.label });
    } else {
        tableRef.value?.clearData();
    }
};
const updateTicked = (value: any[]) => {
    treeTicked.value = value;
};

const updateDone = async (row: BaseObj) => {
    row.edit = false;
};
const updateDel = async (row: BaseObj) => {
    tableRef.value?.delRowByKey(row.ID);
    notify.success('已删除');
};

const apiAfterFormat = (result:any) => {
    const columns = JSON.parse(result.columns || '[]');
    if (columns.length > 0) return columns;
    return result.oldColumns;
};

loadTreeData();
const splitterModel = ref(250);
</script>
<script lang="ts">
export default {
    name: 'FieldConfig',
};
</script>

<style scoped lang="sass">
</style>
