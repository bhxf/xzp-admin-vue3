<template>
    <div class="flex column col q-gutter-y-xs">
        <div class="tools flex column col-auto q-gutter-y-xs q-pb-sm shadow-up-1">
            <div class="q-pl-sm q-pr-sm q-pt-xs row item items-center">
                <slot
                    name="tools"
                    v-bind="{ticked,selected,expanded}"
                />
                <q-space />
                <q-btn
                    flat
                    dense
                    rounded
                    color="primary"
                    round
                    icon="r_expand"
                    @click="onExpandAll"
                >
                    <q-tooltip>
                        展开
                    </q-tooltip>
                </q-btn>
                <q-btn
                    flat
                    dense
                    rounded
                    color="primary"
                    round
                    icon="r_vertical_align_center"
                    @click="onCollapseAll"
                >
                    <q-tooltip>
                        收缩
                    </q-tooltip>
                </q-btn>
                <slot name="refresh">
                    <q-btn
                        flat
                        dense
                        rounded
                        color="primary"
                        round
                        icon="refresh"
                        @click="loadData"
                    >
                        <q-tooltip>
                            刷新
                        </q-tooltip>
                    </q-btn>
                </slot>
            </div>
            <div class="q-pl-md q-pr-md row no-wrap items-center q-gutter-x-xs">
                <q-input
                    v-model="filter"
                    standout
                    dense
                    class="full-width"
                    placeholder="请输入关键字"
                >
                    <template #append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>
        </div>
        <x-scroll-area>
            <div
                v-if="loading"
                class="flex justify-center items-center q-pt-lg"
            >
                <q-spinner-ios
                    color="primary"
                    size="2em"
                />
            </div>
            <q-tree
                v-else
                ref="treeRef"
                v-bind="$attrs"

                v-model:ticked="ticked"
                v-model:selected="selected"
                v-model:expanded="expanded"

                :filter="filter"
                :filter-method="filterMethod"

                :nodes="nodes"
                :label-key="labelKey"
                :node-key="nodeKey"

                no-connectors
                selected-color="primary"
            >
                <template
                    v-for="item in Object.keys($slots)"
                    #[item]="props"
                >
                    <slot
                        :name="item"
                        v-bind="props"
                    />
                </template>
            </q-tree>
        </x-scroll-area>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NavTab } from '@/store/settings/navigation';
import XScrollArea from '@/components/XScrollArea/index.vue';
import { QTreeNode } from 'quasar';

interface TreeProps {
    dataSource?: any[],
    api?: (prams: any) => Promise<any>,
    formatLabel?: (prams: any) => string,
    search?: any,
    defaultValue?: any,
    multiple?: boolean,
    resultKey?: string,
    labelKey?:string,
    nodeKey?:string,
    refresh?: ()=>void
}

const props = withDefaults(defineProps<TreeProps>(), {
    dataSource: () => [],
    api: undefined,
    formatLabel: undefined,
    defaultValue: undefined,
    refresh: undefined,
    multiple: false,
    resultKey: 'list',
    search: {},
    labelKey: 'label',
    nodeKey: 'ID',
});

const loading = ref<boolean>(false);
const filter = ref<string>('');
const selected = ref(null);
const treeRef = ref<{expandAll:()=>void, collapseAll:()=>void}|null>(null);
const ticked = ref([]);
const expanded = ref([]);
const nodes = ref<NavTab[]>([]);

const updateTicked = (tickedList:any) => {
    ticked.value = tickedList;
};
const loadData = async () => {
    try {
        loading.value = true;
        if (typeof props.api === 'function') {
            const result = await props.api(props.search.value);
            nodes.value = result[props.resultKey] || [];
        } else {
            nodes.value = props.dataSource || [];
        }
    } finally {
        loading.value = false;
    }
};
const onExpandAll = () => {
    treeRef.value?.expandAll();
};
const onCollapseAll = () => {
    treeRef.value?.collapseAll();
};

const filterMethod = (node: QTreeNode, filter: string) => {
    const key = filter.toLowerCase();
    let label = node[props.labelKey];
    if (typeof props.formatLabel === 'function') {
        label = props.formatLabel(node);
    }
    return label && label.toLowerCase().indexOf(key) > -1;
};

const init = () => {
    if (props.multiple) {
        ticked.value = props.defaultValue || [];
    } else {
        selected.value = props.defaultValue || null;
    }

    loadData();
};
init();
defineExpose({ treeRef, loadData, updateTicked });

</script>
<script lang="ts">
export default {
    name: 'XTree',
};
</script>

<style scoped lang="sass">
.body--light
    .tools
        background: white

.body--dark
    .tools
        background: $dark
</style>
