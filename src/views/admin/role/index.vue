<template>
    <default-content>
        <template #default="prop">
            <q-splitter
                v-model="splitterModel"
                unit="px"
            >
                <template #before>
                    <!--树组件-->
                    <div
                        class="flex column"
                        :style="{height:prop.pageHeight}"
                    >
                        <x-tree
                            ref="treeRef"
                            :api="getAuthorityList"
                            result-key="list"
                            node-key="authorityId"
                            label-key="authorityName"

                            @update:selected="updateSelected"
                            @update:ticked="updateTicked"
                        >
                            <template #tools>
                                <q-btn
                                    flat
                                    dense
                                    round
                                    color="primary"
                                    icon="o_add"
                                    @click="onAdd"
                                />
                                <q-btn
                                    :disable="isDel"
                                    flat
                                    dense
                                    round
                                    icon="o_delete"
                                    color="red"
                                    @click="onDel"
                                />
                            </template>
                            <template #default-header="prop">
                                <div class="flex column justify-start">
                                    <div class="text-weight-bold text-caption">
                                        {{ prop.node.authorityName }}
                                    </div>
                                    <div class="text-caption">
                                        {{ prop.node.authorityId }}
                                    </div>
                                </div>
                            </template>
                        </x-tree>
                    </div>

                    <!--新增-->
                    <x-dialog v-model="loadings['add']">
                        <template #title>
                            <div class="text-h6">
                                {{ getTitle }}角色
                            </div>
                        </template>
                        <x-form
                            ref="formRef"
                            :fields="initRoleForm"
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
                    <RoleDetail
                        ref="detailRef"
                        :style="{height: prop.pageHeight}"
                    />
                </template>
            </q-splitter>
        </template>
    </default-content>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import XTree from '@/components/XTree/index.vue';
import XForm from '@/components/XForm/index.vue';
import XDialog from '@/components/XDialog/index.vue';

import { roleForm } from '@/views/admin/role/data';
import { dialog, notify } from '@/hooks/message';
import {
    createAuthority, deleteAuthority, getAuthorityList, updateAuthority,
} from '@/api/system/role';
import {
    actionCondition, actionConst, actionLoading, actionRef, actionTitle,
} from '@/tools/action/curd';
import RoleDetail from '@/views/admin/role/detail.vue';
import DefaultContent from '@/layouts/content/DefaultContent.vue';

const { action, getTitle } = actionTitle('角色');
const { formRef, treeRef, detailRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const { treeSelected, treeTicked } = actionConst();
const { isDel } = actionCondition(treeSelected, treeTicked);

const updateSelected = async (value: any) => {
    treeSelected.value = value;
    detailRef.value?.loadData(treeSelected.value);
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
            if (action.value === 'add') await createAuthority(info);
            else await updateAuthority(info);

            notify.success(`${getTitle.value}成功`);

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
const onDel = async () => {
    dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        await deleteAuthority({ authorityId: treeSelected.value });
        notify.success('删除成功');
        treeRef.value?.loadData();
    }, () => {
    });
};

const initRoleForm = computed(() => {
    roleForm.forEach((item) => {
        if (item.name === 'parentId') {
            item.defaultValue = treeSelected.value;
        }
    });

    return roleForm;
});
const splitterModel = ref(250);

</script>
<script lang="ts">
export default {
    name: 'Role',
};
</script>

<style scoped lang="sass">
</style>
