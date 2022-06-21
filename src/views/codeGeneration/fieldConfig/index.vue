<template>
    <q-splitter
        v-model="splitterModel"
        unit="px"
    >
        <template #before>
            <div
                class="flex column"
                :style="getHeight"
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
                :hide-pagination="true"

                :height="getHeight"
                :columns="fieldColumns"

                :search="search"
                :btn-list="btnList"
                :api="getColumn"
                :add-row-boj="{keepAlive: true,closeTab:true ,collect: true,sort:0}"

                edit="row"
                row-key="name"
                result-key="oldColumns"

                @update-done="updateDone"
                @update-del="updateDel"
            />
        </template>
    </q-splitter>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import XTable from '@/components/XTable/index.vue';
import XTree from '@/components/XTree/index.vue';
import { notify } from '@/hooks/message';
import useLayoutStore from '@/store/settings/layout';
import {
    actionConst, actionLoading, actionRef,
} from '@/tools/action/curd';
import { BaseObj } from '@/types';
import { getColumn, getDB, getTables } from '@/api/codeGeneration/field';
import { fieldColumns } from '@/views/codeGeneration/fieldConfig/data';
import { QTreeNode } from 'quasar';

const btnList = [
    {
        icon: 'o_add',
        isDisable: () => !treeSelected.value,
        tooltip: '新增一行',
        onClick: () => tableRef.value?.addFirst(),
    },
];
const treeData = ref([]);
const { formRef, tableRef, treeRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const {
    search, tableSelected, treeSelected, treeTicked,
} = actionConst();

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
const updateSelected = (value: any) => {
    treeSelected.value = value;
    const node = treeRef?.value?.treeRef.getNodeByKey(value);
    if (node.type === 'table') tableRef.value?.loadData({ dbName: node.dbName, tableName: node.label });
};
const updateTicked = (value: any[]) => {
    treeTicked.value = value;
};

const updateDone = async (row: BaseObj) => {
    row.edit = false;
};
const updateDel = async (row: BaseObj) => {
};

loadTreeData();
const splitterModel = ref(250);
const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));

</script>
<script lang="ts">
export default {
    name: 'FieldConfig',
};
</script>

<style scoped lang="sass">
</style>
