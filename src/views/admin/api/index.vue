<template>
    <x-table
        ref="tableRef"
        edit="row"

        v-model:selected="tableSelected"

        :api="getApiList"
        :height="getHeight"
        :columns="apiColumns"
        :btn-list="btnList"

    >
    </x-table>
</template>

<script setup lang="ts">
import {apiColumns} from "@/views/admin/api/data";

import {computed} from "vue";
import XTable from "@/components/XTable/index.vue";
import {getApiList} from "@/api/system/api";
import {useLayoutStore} from "@/store/settings/layout";
import {actionConst, actionRef} from "@/tools/action/curd";
import {dialog, notify} from "@/hooks/message";
import {deleteSysDictionaryDetailByIds} from "@/api/system/dictionary";

const {tableRef} = actionRef()
const {search, tableSelected} = actionConst()
const btnList = [
    {
        icon: 'o_add',
        tooltip: '新增一行',
        onClick: () => tableRef.value?.addFirst()
    },
    {
        icon: 'o_delete',
        color: 'red',
        isDisable: ()=>tableSelected.value.length===0,
        tooltip: '批量删除',
        onClick: async () => {
            dialog.confirm('操作提示', '你确定要删除吗？', async () => {
                await deleteSysDictionaryDetailByIds({ids:tableSelected.value.map((item:any)=>item.ID)})
                notify.success(`删除成功`)
                tableRef.value?.loadData()
            }, () => {
            })
        }
    },
]

const getHeight = computed(() => {
    return {height: useLayoutStore().getPageHeight}
})

</script>
<script lang="ts">
export default {
    name: "Menu",
};
</script>

<style scoped lang="sass">
</style>
