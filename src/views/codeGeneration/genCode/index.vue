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

                            :api="getCodeTemplateTree"

                            result-key="list"
                            node-key="ID"
                            label-key="name"

                            @update:selected="updateSelected"
                        >
                            <template #default-header="prop">
                                <div class="row no-wrap items-center q-gutter-x-xs">
                                    <q-icon
                                        :name="prop.node.codeType === 'folder' ?'r_folder_open' :'r_description'"
                                    />
                                    <div>
                                        {{ prop.node.name }}
                                    </div>
                                </div>
                            </template>
                        </x-tree>
                    </div>
                </template>

                <template #after>
                    <GenCodeDetail
                        ref="detailRef"
                        :style="{height:prop.pageHeight}"
                    />
                </template>
            </q-splitter>
        </template>
    </default-content>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import XTree from '@/components/XTree/index.vue';
import {
    actionConst, actionRef,
} from '@/tools/action/curd';
import {
    getCodeTemplateTree,
} from '@/api/codeGeneration/template';
import DefaultContent from '@/layouts/content/DefaultContent.vue';
import GenCodeDetail from '@/views/codeGeneration/genCode/detail.vue';

const { treeRef, detailRef } = actionRef();
const {
    treeSelected,
} = actionConst();
const updateSelected = (value: any) => {
    treeSelected.value = value;
    const node = treeRef?.value?.treeRef.getNodeByKey(value);
    detailRef.value?.loadData(node);
};

const splitterModel = ref(300);
</script>
<script lang="ts">
export default {
    name: 'CodeTemplate',
};
</script>

<style scoped lang="sass">
</style>
