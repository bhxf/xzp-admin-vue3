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
                    ref="treeRef"

                    :api="getCodeTemplateTree"

                    result-key="list"
                    node-key="ID"
                    label-key="name"

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
                            :disable="isEdit"
                            flat
                            dense
                            round
                            icon="o_edit"
                            color="orange"
                            @click="onEdit"
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
                </x-tree>
            </div>
            <!--新增菜单-->
            <x-dialog v-model="loadings['add']">
                <template #title>
                    <div class="text-h6">
                        {{ getTitle }}
                    </div>
                </template>
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
            <div :style="getHeight">
                <XMonaco
                    v-model="code"
                    :model="getModel"
                />
            </div>
        </template>
    </q-splitter>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import XTree from '@/components/XTree/index.vue';
import XForm from '@/components/XForm/index.vue';

import { dialog, notify } from '@/hooks/message';
import XDialog from '@/components/XDialog/index.vue';
import useLayoutStore from '@/store/settings/layout';
import {
    actionCondition, actionConst, actionLoading, actionRef, actionTitle,
} from '@/tools/action/curd';
import {
    createCodeTemplate,
    deleteCodeTemplate,
    getCodeTemplateTree,
    updateCodeTemplate,
} from '@/api/codeGeneration/template';
import XMonaco from '@/components/XMonaco/index.vue';
import { useQuasar } from 'quasar';

const code = ref('');
const name = ref('');

const { action, getTitle } = actionTitle('角色');
const { formRef, treeRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const {
    treeSelected, treeTicked,
} = actionConst();
const { isEdit, isDel } = actionCondition(treeSelected, treeTicked);

const updateSelected = (value: any) => {
    treeSelected.value = value;
    const node = treeRef?.value?.treeRef.getNodeByKey(value);
    code.value = node?.context || '';
    name.value = node?.name || '';
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
            if (action.value === 'add') await createCodeTemplate(info);
            else await updateCodeTemplate(info);

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
    // action.value = 'edit';
    // const { menu } = await getBaseMenuById({ id: treeSelected.value || treeTicked.value[0].ID });
    // loadings.value.add = true;
    // await nextTick();
    // const detail: any = menu;
    // detail.icon = menu.meta?.icon;
    // detail.title = menu.meta?.title;
    // detail.keepAlive = menu.meta?.keepAlive;
    // detail.closeTab = menu.meta?.closeTab;
    // formRef.value?.updateObj(detail);
};
const onDel = async () => {
    dialog.confirm('操作提示', '你确定要删除吗？', async () => {
        await deleteCodeTemplate({ id: treeSelected.value });
        notify.success('删除成功');
        treeRef.value?.loadData();
    }, () => {
    });
};

const splitterModel = ref(300);
const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));
const getModel = computed(() => {
    const modelType = name.value.split('.');
    console.log(modelType);
    return modelType[modelType.length - 1];
});

</script>
<script lang="ts">
export default {
    name: 'CodeTemplate',
};
</script>

<style scoped lang="sass">
</style>
