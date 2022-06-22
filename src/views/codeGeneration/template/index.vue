<template>
    <default-content>
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
                    >
                        <template #tools>
                            <q-btn
                                color="primary"
                                flat
                                dense
                                round
                                icon="r_folder_open"
                                @click="onAddFolder"
                            >
                                <q-tooltip>新增文件夹</q-tooltip>
                            </q-btn>
                            <q-btn
                                color="primary"
                                flat
                                dense
                                round
                                icon="r_description"
                                @click="onAddFile"
                            >
                                <q-tooltip>新增文件</q-tooltip>
                            </q-btn>
                            <q-btn
                                color="orange"
                                :disable="isEdit"
                                flat
                                dense
                                round
                                icon="r_edit"
                                @click="onEditName"
                            >
                                <q-tooltip>修改名称</q-tooltip>
                            </q-btn>
                            <q-btn
                                :disable="isDel"
                                flat
                                dense
                                round
                                icon="r_delete"
                                color="red"
                                @click="onDelete"
                            />
                        </template>
                        <template #default-header="prop">
                            <div class="row items-center">
                                <q-icon :name="prop.node.codeType === 'folder' ?'r_folder_open' :'r_description'"/>
                                <div class="text-weight-bold">
                                    {{ prop.node.name }}
                                </div>
                            </div>
                            <q-menu
                                class="shadow-10 text-weight-medium text-grey-8"
                                touch-position
                                context-menu
                                auto-close
                            >
                                <q-list
                                    dense
                                    padding
                                >
                                    <q-item
                                        clickable
                                        @click="onAddFolder(prop.node)"
                                    >
                                        <q-item-section>
                                            <div class="row no-wrap items-center q-gutter-x-sm">
                                                <q-icon
                                                    color="primary"
                                                    size="xs"
                                                    name="r_folder_open"
                                                />
                                                <q-item-label lines="1">
                                                    新建文件夹
                                                </q-item-label>
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                    <q-item
                                        clickable
                                        @click="onAddFile(prop.node)"
                                    >
                                        <q-item-section>
                                            <div class="row no-wrap items-center q-gutter-x-sm">
                                                <q-icon
                                                    color="primary"
                                                    size="xs"
                                                    name="r_description"
                                                />
                                                <q-item-label lines="1">
                                                    新建文件
                                                </q-item-label>
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                    <q-item
                                        clickable
                                        @click="onEditName(prop.node)"
                                    >
                                        <q-item-section>
                                            <div class="row no-wrap items-center q-gutter-x-sm">
                                                <q-icon
                                                    color="orange"
                                                    size="xs"
                                                    name="r_edit"
                                                />
                                                <q-item-label lines="1">
                                                    修改名称
                                                </q-item-label>
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                    <q-item
                                        clickable
                                        @click="onDelete(prop.node)"
                                    >
                                        <q-item-section>
                                            <div class="row no-wrap items-center q-gutter-x-sm">
                                                <q-icon
                                                    color="red"
                                                    size="xs"
                                                    name="r_delete"
                                                />
                                                <q-item-label lines="1">
                                                    删除
                                                </q-item-label>
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </template>
                    </x-tree>
                </div>
            </template>

            <template #after>
                <TemplateDetail ref="detailRef" />
            </template>
        </q-splitter>
    </default-content>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import XTree from '@/components/XTree/index.vue';
import { notify } from '@/hooks/message';
import useLayoutStore from '@/store/settings/layout';
import {
    actionCondition,
    actionConst, actionLoading, actionRef, actionTitle,
} from '@/tools/action/curd';
import {
    createCodeTemplate,
    deleteCodeTemplate,
    getCodeTemplateTree,
    updateCodeTemplate,
} from '@/api/codeGeneration/template';
import { useQuasar } from 'quasar';
import TemplateDetail from '@/views/codeGeneration/template/detail.vue';
import DefaultContent from '@/layouts/content/DefaultContent.vue';

const $q = useQuasar();
const selectedNode = ref();
const { action, getTitle } = actionTitle('');
const { formRef, treeRef, detailRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const {
    treeSelected,
    treeTicked,
} = actionConst();
const { isEdit, isDel } = actionCondition(treeSelected, treeTicked);

const initValue = () => {
    selectedNode.value = null;
    treeSelected.value = '';
};
const updateSelected = (value: any) => {
    treeSelected.value = value;
    const node = treeRef?.value?.treeRef.getNodeByKey(value);
    selectedNode.value = node;
    detailRef.value?.loadData(value);
};
const handleSave = async (info:any) => {
    if (action.value === 'add') await createCodeTemplate(info);
    else await updateCodeTemplate(info);

    notify.success(`${getTitle.value}成功`);

    initValue();
    treeRef.value?.loadData();
};
const onAddFolder = (node:any) => {
    action.value = 'add';
    const parentId = node?.ID || selectedNode.value?.ID;

    $q.dialog({
        title: '新建文件夹',
        prompt: {
            model: '',
            isValid: (val) => val.length > 0,
            type: 'text',
        },
        cancel: true,
        persistent: true,
    }).onOk((data) => {
        const info = {
            codeType: 'folder',
            name: data,
            parentId,
        };
        handleSave(info);
    });
};
const onAddFile = (node:any) => {
    action.value = 'add';
    const parentId = node?.ID || selectedNode.value?.ID;
    $q.dialog({
        title: '新建文件',
        prompt: {
            model: '',
            isValid: (val) => val.length > 0,
            type: 'text',
        },
        cancel: true,
        persistent: true,
    }).onOk((data) => {
        const info = {
            codeType: 'file',
            name: data,
            parentId,
        };
        console.log(info);
        handleSave(info);
    });
};
const onEditName = (node:any) => {
    action.value = 'edit';
    const ID = node?.ID || selectedNode.value?.ID;
    const name = node?.name || selectedNode.value?.name;
    const codeType = node?.codeType || selectedNode.value?.codeType;
    $q.dialog({
        title: '修改名称',
        prompt: {
            model: name,
            isValid: (val) => val.length > 0,
            type: 'text',
        },
        cancel: true,
        persistent: true,
    }).onOk((data) => {
        const info = {
            codeType,
            name: data,
            ID,
        };
        handleSave(info);
    });
};
const onDelete = (node:any) => {
    action.value = 'del';
    const ID = node?.ID || selectedNode.value?.ID;

    $q.dialog({
        title: '删除提示',
        message: '你确定要删除吗?',
        cancel: true,
        persistent: true,
    }).onOk(async () => {
        await deleteCodeTemplate({ ID });
        notify.success(`${getTitle.value}成功`);
        initValue();
        treeRef.value?.loadData();
    });
};

const splitterModel = ref(300);
const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));

</script>
<script lang="ts">
export default {
    name: 'CodeTemplate',
};
</script>

<style scoped lang="sass">
</style>
