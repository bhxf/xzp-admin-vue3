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
                            ref="treeRef"

                            :api="getMenuList"

                            result-key="list"
                            node-key="ID"
                            label-key="meta.title"

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
                            <template #default-header="prop">
                                <div class="row items-center q-gutter-x-xs">
                                    <q-icon
                                        size="xs"
                                        :name="prop.node.meta?.icon"
                                    />
                                    <div>{{ prop.node.meta?.title }}</div>
                                </div>
                            </template>
                        </x-tree>
                    </div>

                    <!--新增菜单-->
                    <x-dialog
                        v-model="loadings['add']"
                        :title="getTitle"
                    >
                        <x-form
                            ref="formRef"
                            :fields="initMenuForm"
                        />
                        <template #actions>
                            <q-btn
                                :loading="loadings['save']"
                                color="primary"
                                unelevated
                                label="保存"
                                @click="onSave"
                            />
                            <q-btn
                                v-close-popup
                                flat
                                label="取消"
                            />
                        </template>
                    </x-dialog>
                </template>

                <template #after>
                    <x-table
                        ref="tableRef"
                        v-model:selected="tableSelected"

                        :load-first="false"
                        :hide-pagination="true"

                        :height="prop.pageHeight"
                        :columns="menuColumns"

                        :search="search"
                        :btn-list="btnList"
                        :filter-list="menuFilterList"
                        :search-list="menuSearchList"
                        :after-format="afterFormat"
                        :api="getBaseMenuByParentId"
                        :add-row-boj="{keepAlive: true,closeTab:true ,collect: true,sort:0}"

                        edit="row"
                        row-key="name"
                        result-key="menus"

                        @update-done="updateDone"
                        @update-del="updateDel"
                    />
                </template>
            </q-splitter>
        </template>
    </default-content>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import XTable from '@/components/XTable/index.vue';
import XTree from '@/components/XTree/index.vue';
import XForm from '@/components/XForm/index.vue';
import {
    menuColumns, menuForm, menuSearchList, menuFilterList,
} from '@/views/admin/menu/data';
import {
    addMenu, getMenuList, getBaseMenuById, getBaseMenuByParentId, updateMenu, deleteMenu,
} from '@/api/system/menu';
import { dialog, notify } from '@/hooks/message';
import XDialog from '@/components/XDialog/index.vue';
import {
    actionCondition, actionConst, actionLoading, actionRef, actionTitle,
} from '@/tools/action/curd';
import { BaseObj } from '@/types';
import { clone } from 'lodash-es';
import DefaultContent from '@/layouts/content/DefaultContent.vue';

const btnList = [
    {
        icon: 'o_add',
        isDisable: () => !treeSelected.value,
        tooltip: '新增一行',
        onClick: () => tableRef.value?.addRow(),
    },
];
const { action, getTitle } = actionTitle('角色');
const { formRef, tableRef, treeRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const {
    search, tableSelected, treeSelected, treeTicked,
} = actionConst();
const { isEdit, isDel } = actionCondition(treeSelected, treeTicked);

const updateSelected = (value: any) => {
    treeSelected.value = value;
    tableRef.value?.loadData({ id: value?.toString() || '' });
};
const updateTicked = (value: any[]) => {
    treeTicked.value = value;
};

const onSave = async () => {
    const bool = await formRef.value?.getFormRef.validate();
    if (bool) {
        loadings.value.save = true;
        const info = JSON.parse(JSON.stringify(formRef.value?.formInfo));
        try {
            if (!info.parentId) {
                info.parentId = 0;
            }

            info.parentId = info.parentId.toString();
            info.meta = {};
            info.meta.title = info.title;
            info.meta.icon = info.icon;
            info.meta.keepAlive = info.keepAlive;
            info.meta.closeTab = info.closeTab;
            info.meta.collect = info.collect;

            if (action.value === 'add') await addMenu(info);
            else await updateMenu(info);

            notify.success(`${getTitle.value}菜单成功`);

            loadings.value.add = false;
            treeRef.value?.loadData();
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
    const { menu } = await getBaseMenuById({ id: treeSelected.value || treeTicked.value[0].ID });
    loadings.value.add = true;
    await nextTick();
    const detail: any = menu;
    detail.icon = menu.meta?.icon;
    detail.title = menu.meta?.title;
    detail.keepAlive = menu.meta?.keepAlive;
    detail.closeTab = menu.meta?.closeTab;
    formRef.value?.updateObj(detail);
};
const onDel = async () => {
    dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        await deleteMenu({ id: treeSelected.value });
        notify.success('删除成功');
        treeRef.value?.loadData();
    }, () => {
    });
};
const afterFormat = (data: any[]) => data.map((item) => {
    item.title = item?.meta?.title;
    item.icon = item?.meta?.icon;
    item.keepAlive = item?.meta?.keepAlive;
    item.closeTab = item?.meta?.closeTab;
    item.collect = item?.meta?.collect;
    return item;
});

const updateDone = async (row: BaseObj) => {
    try {
        row.loading = true;
        const info:BaseObj = clone(row);
        info.parentId = info.parentId.toString();
        info.meta = {};
        info.meta.title = info.title;
        info.meta.icon = info.icon;
        info.meta.keepAlive = info.keepAlive;
        info.meta.closeTab = info.closeTab;
        info.meta.collect = info.collect;

        if (row.editType === 'add') {
            const { detail } = await addMenu(info);
            row.ID = detail.ID;
            row.CreatedAt = detail.CreatedAt;
            notify.success('保存成功');
        } else {
            await updateMenu(info);
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
        await deleteMenu({ ID: row.ID });
        notify.success('删除成功');
        tableRef.value?.loadData();
    } finally {
        row.loading = false;
    }
};

const initMenuForm = computed(() => {
    menuForm.forEach((item) => {
        if (item.name === 'parentId') {
            item.defaultValue = treeSelected.value;
        }
    });

    return menuForm;
});

const splitterModel = ref(250);

</script>
<script lang="ts">
export default {
    name: 'AdminMenu',
};
</script>

<style scoped lang="sass">
</style>
