<template>
    <default-content>
        <template #default="prop">
            <x-table
                ref="tableRef"
                v-model:selected="tableSelected"

                edit="row"

                :api="getApiList"
                :btn-list="btnList"
                :height="prop.pageHeight"
                :columns="apiColumns"

                @update-done="updateDone"
                @update-del="updateDel"
            />
        </template>
    </default-content>
</template>

<script setup lang="ts">
import { apiColumns } from '@/views/admin/api/data';

import XTable from '@/components/XTable/index.vue';
import {
    createApi, deleteApi, getApiList, updateApi, deleteApisByIds,
} from '@/api/system/api';
import { actionConst, actionRef } from '@/tools/action/curd';
import { dialog, notify } from '@/hooks/message';
import { BtnGroup } from '@/components';
import { BaseObj } from '@/types';
import DefaultContent from '@/layouts/content/DefaultContent.vue';

const { tableRef } = actionRef();
const {
    tableSelected,
} = actionConst();
const btnList:BtnGroup[] = [
    {
        icon: 'o_add',
        tooltip: '新增一行',
        key: 'add',
        onClick: () => tableRef.value?.addRow(),
    },
    {
        icon: 'o_delete',
        color: 'red',
        key: 'delete',
        isDisable: () => tableSelected.value.length === 0,
        tooltip: '批量删除',
        onClick: async () => {
            dialog.confirm('操作提示', '你确定要删除吗？', async () => {
                await deleteApisByIds(
                    { ids: tableSelected.value.map((item:any) => item.ID) },
                );
                notify.success('删除成功');
                tableRef.value?.loadData();
            }, () => {
            });
        },
    },
];

const updateDone = async (row: BaseObj) => {
    try {
        row.loading = true;
        if (row.editType === 'add') {
            const { detail } = await createApi(row);
            row.ID = detail.ID;
            row.CreatedAt = detail.CreatedAt;
            notify.success('保存成功');
        } else {
            await updateApi(row);
            notify.success('编辑成功');
        }
    } finally {
        row.loading = false;
    }
    row.edit = false;
};
const updateDel = async (row: BaseObj) => {
    try {
        row.loading = true;
        await deleteApi({ ID: row.ID });
        notify.success('删除成功');
        tableRef.value?.loadData();
    } finally {
        row.loading = false;
    }
};

</script>
<script lang="ts">
export default {
    name: 'Api',
};
</script>

<style scoped lang="sass">
</style>
