<template>
  <x-table
    ref="tableRef"
    v-model:selected="tableSelected"

    edit="row"

    :api="getApiList"
    :height="getHeight"
    :columns="apiColumns"
    :btn-list="btnList"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { apiColumns } from '@/views/admin/api/data';

import XTable from '@/components/XTable/index.vue';
import { getApiList } from '@/api/system/api';
import { useLayoutStore } from '@/store/settings/layout';
import { actionConst, actionRef } from '@/tools/action/curd';
import { dialog, notify } from '@/hooks/message';
import { deleteSysDictionaryDetailByIds } from '@/api/system/dictionary';
import { BtnGroup } from '@/components';

const { tableRef } = actionRef();
const { tableSelected } = actionConst();
const btnList:BtnGroup[] = [
  {
    icon: 'o_add',
    tooltip: '新增一行',
    key: 'add',
    onClick: () => tableRef.value?.addFirst(),
  },
  {
    icon: 'o_delete',
    color: 'red',
    key: 'delete',
    isDisable: () => tableSelected.value.length === 0,
    tooltip: '批量删除',
    onClick: async () => {
      dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        await deleteSysDictionaryDetailByIds(
          { ids: tableSelected.value.map((item:any) => item.ID) },
        );
        notify.success('删除成功');
        tableRef.value?.loadData();
      }, () => {
      });
    },
  },
];

const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));

</script>
<script lang="ts">
export default {
  name: 'Api',
};
</script>

<style scoped lang="sass">
</style>
