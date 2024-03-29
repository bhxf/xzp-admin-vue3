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
                        <x-list
                            ref="listRef"
                            :api="getSysDictionaryList"
                            name-key="ID"
                            label-key="name"
                            tick-strategy="leaf"
                            keyword="name"

                            @update:selected="updateSelected"
                            @update:ticked="updateTicked"
                        >
                            <template #tools>
                                <q-btn
                                    flat
                                    dense
                                    color="primary"
                                    icon="o_add"
                                    @click="onAdd"
                                />
                                <q-btn
                                    :disable="isEdit"
                                    flat
                                    dense
                                    icon="o_edit"
                                    color="orange"
                                    @click="onEdit"
                                />
                                <q-btn
                                    :disable="isDel"
                                    flat
                                    dense
                                    icon="o_delete"
                                    color="red"
                                    @click="onDel"
                                />
                            </template>
                            <template #item="{item}">
                                <q-item-section>
                                    <q-item-label>
                                        {{ item.name }}
                                    </q-item-label>
                                    <q-item-label caption>
                                        <div class="row q-gutter-x-xs items-center">
                                            <div>{{ item.ID }}</div>
                                            <q-btn
                                                size="xs"
                                                icon="r_content_copy"
                                                color="primary"
                                                flat
                                                dense
                                                round
                                                @click.stop="onCopyCode(item.ID)"
                                            >
                                                <q-tooltip>复制编码</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <div class="row q-gutter-x-xs">
                                        <q-toggle
                                            v-model="item.status"
                                            dense
                                            color="primary"
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
                            <div class="text-h6">
                                {{ getTitle }}
                            </div>
                        </template>
                        <x-form
                            ref="formRef"
                            :fields="dictionaryForm"
                        />
                        <template #actions>
                            <q-btn
                                :loading="loadings['save']"
                                color="primary"
                                label="保存"
                                @click="onSave"
                            />
                            <q-btn
                                v-close-popup
                                flat
                                label="取消"
                                color="primary"
                            />
                        </template>
                    </x-dialog>
                </template>

                <template #after>
                    <x-table
                        ref="tableRef"
                        v-model:selected="tableSelected"

                        :load-first="false"
                        :height="prop.pageHeight"

                        :columns="dictionaryColumns"
                        :btn-list="btnList"
                        :search="search"
                        :search-list="dictionarySearch"
                        :api="getSysDictionaryDetailList"
                        :add-row-boj="{status: true, sysDictionaryID: treeSelected,sort:0}"
                        edit="row"

                        row-key="ID"

                        @update-done="updateDone"
                        @update-del="updateDel"
                    />
                </template>
            </q-splitter>
        </template>
    </default-content>
</template>

<script setup lang="ts">

import { nextTick, ref } from 'vue';
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
import { BaseObj } from '@/types';
import DefaultContent from '@/layouts/content/DefaultContent.vue';

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
        onClick: () => tableRef.value?.addRow(),
    },
    {
        icon: 'o_delete',
        color: 'red',
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

const updateStatus = async (value:boolean, row:BaseObj) => {
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

const updateDone = async (row: BaseObj) => {
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
const updateDel = async (row: BaseObj) => {
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

</script>
<script lang="ts">
export default {
    name: 'AdminDictionary',
};
</script>

<style scoped lang="sass">
</style>
