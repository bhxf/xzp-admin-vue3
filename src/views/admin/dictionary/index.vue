<template>
    <q-splitter
        v-model="splitterModel"
        unit="px"
    >
        <template v-slot:before>
            <div class="flex column" :style="getHeight">
                <x-list
                    :api="getSysDictionaryList"
                    ref="listRef"
                    name-key="ID"
                    label-key="name"
                    tick-strategy="leaf"
                    keyword="name"

                    @update:selected="updateSelected"
                    @update:ticked="updateTicked"
                >
                    <template #tools="prop">
                        <q-btn flat dense round color="primary" icon="o_add" @click="onAdd"/>
                        <q-btn :disable="isEdit" flat dense round icon="o_edit" color="orange" @click="onEdit"/>
                        <q-btn :disable="isDel" flat dense round icon="o_delete" color="red" @click="onDel"/>
                    </template>
                    <template #item="{item}">
                        <q-item-section>
                            <q-item-label>
                                {{ item.name }}
                            </q-item-label>
                            <q-item-label caption>
                                {{ item.type }}
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-x-xs">
                                <q-btn icon="r_content_copy" color="primary" flat dense round @click.stop="onCopyCode(item.type)">
                                    <q-tooltip>复制编码</q-tooltip>
                                </q-btn>
                                <q-toggle
                                    dense
                                    color="primary"
                                    v-model="item.status"
                                    @update:model-value="(value)=>updateStatus(value,item)"
                                />
                            </div>
                        </q-item-section>

                        <q-inner-loading
                            color="primary"
                            :showing="item.loading"
                            label="保存中"
                            label-style="font-size: 1em"
                        />
                    </template>
                </x-list>
            </div>

            <!--新增-->
            <x-dialog v-model="loadings['add']">
                <template #title>
                    <div class="text-h6">{{ getTitle }}</div>
                </template>
                <x-form ref="formRef" :fields="dictionaryForm"/>
                <template #actions>
                    <q-btn :loading="loadings['save']" color="primary" label="保存" @click="onSave"/>
                    <q-btn flat label="取消" color="primary" v-close-popup/>
                </template>
            </x-dialog>

        </template>

        <template v-slot:after>
            <x-table
                ref="tableRef"
                v-model:selected="tableSelected"

                @update-done="updateDone"
                @update-del="updateDel"

                :load-first="false"
                :height="getHeight"
                :columns="dictionaryColumns"
                :btn-list="btnList"
                :search="search"
                :search-list="dictionarySearch"
                :api="getSysDictionaryDetailList"

                :add-row-boj="{status: true, sysDictionaryID: treeSelected,sort:0}"

                edit="row"
                row-key="ID"
            >
            </x-table>
        </template>

    </q-splitter>
</template>

<script setup lang="ts">

import { computed, nextTick, ref } from 'vue';
import { toClipboard } from '@soerenmartius/vue3-clipboard';
import {
  actionCondition, actionConst, actionLoading, actionRef, actionTitle,
} from '@/tools/action/curd';
import { dialog, notify } from '@/hooks/message';
import { dictionaryForm, dictionaryColumns, dictionarySearch } from '@/views/admin/dictionary/data';
import {
  getSysDictionaryList,
  getSysDictionaryDetailList,
  createDictionary,
  updateSysDictionary,
  deleteSysDictionary,
  deleteSysDictionaryDetail,
  createDictionaryDetail,
  updateSysDictionaryDetail,
  findSysDictionary,
  deleteSysDictionaryDetailByIds,
} from '@/api/system/dictionary';

import XForm from '@/components/XForm/index.vue';
import XDialog from '@/components/XDialog/index.vue';
import XTable from '@/components/XTable/index.vue';
import XList from '@/components/XList/index.vue';
import { useLayoutStore } from '@/store/settings/layout';
import { setupClipboard } from '@/plugins/clipboard';

const { action, getTitle } = actionTitle('字典');
const { formRef, tableRef, listRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const {
  search, tableSelected, treeSelected, treeTicked,
} = actionConst();
const { isEdit, isDel } = actionCondition(treeSelected, treeTicked);

const btnList = [
  {
    icon: 'o_add',
    isDisable: () => !treeSelected.value,
    tooltip: '新增一行',
    onClick: () => tableRef.value?.addFirst(),
  },
  {
    icon: 'o_delete',
    color: 'red',
    isDisable: () => tableSelected.value.length === 0,
    tooltip: '批量删除',
    onClick: async () => {
      dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        await deleteSysDictionaryDetailByIds({ ids: tableSelected.value.map((item:any) => item.ID) });
        notify.success('删除成功');
        tableRef.value?.loadData();
      }, () => {
      });
    },
  },
];

const updateStatus = async (value:boolean, row:any) => {
  try {
    row.loading = true;
    const bool = value ? '启用' : '禁用';
    await updateSysDictionary(row);
    notify.success(`${bool}成功`);
  } catch (e) {
    row.status = !value;
  } finally {
    row.loading = false;
  }
};
const updateSelected = (value: any) => {
  treeSelected.value = value;
  tableRef.value?.loadData({ sysDictionaryID: value?.toString() });
};
const updateTicked = (value: any[]) => {
  treeTicked.value = value;
  tableRef.value?.loadData({ id: value?.toString() });
};

const onCopyCode = (code:string) => {
  toClipboard(code);
  notify.success('复制成功');
};
const onSave = async () => {
  const bool = await formRef.value?.getFormRef.validate();
  if (bool) {
    loadings.value.save = true;
    const info = JSON.parse(JSON.stringify(formRef.value?.formInfo));
    try {
      if (action.value === 'add') await createDictionary(info);
      else await updateSysDictionary(info);

      notify.success(`${getTitle.value}成功`);

      loadings.value.add = false;
      listRef.value?.loadData();
    } finally {
      loadings.value.save = false;
    }
  }
};
const onAdd = () => {
  action.value = 'add';
  loadings.value.add = true;
};
const onEdit = async () => {
  action.value = 'edit';
  const { detail } = await findSysDictionary({ ID: treeSelected.value });
  loadings.value.add = true;
  await nextTick();
  formRef.value?.updateObj(detail);
};
const onDel = async () => {
  dialog.confirm('操作提示', '你确定要删除吗？', async () => {
    await deleteSysDictionary({ ID: treeSelected.value });
    notify.success('删除成功');
    listRef.value?.loadData();
    tableRef.value?.loadData();
  }, () => {
  });
};

const updateDone = async (row: any) => {
  try {
    row.loading = true;
    if (row.editType === 'add') {
      const { detail } = await createDictionaryDetail(row);
      row.ID = detail.ID;
      row.CreatedAt = detail.CreatedAt;
      row.sysDictionaryID = treeSelected.value;
      notify.success('保存成功');
    } else {
      await updateSysDictionaryDetail(row);
      notify.success('编辑成功');
    }
  } finally {
    row.loading = false;
  }
  row.edit = false;
};
const updateDel = async (row: any) => {
  try {
    row.loading = true;
    await deleteSysDictionaryDetail({ ID: row.ID });
    notify.success('删除成功');
    tableRef.value?.loadData();
  } finally {
    row.loading = false;
  }
};

const splitterModel = ref(250);
const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));

</script>
<script lang="ts">
export default {
  name: 'Dictionary',
};
</script>

<style scoped lang="sass">
</style>
