<template>
    <q-field
        v-model="selected"
        v-bind="componentsProps"
        :stack-label="showClear"
        :loading="loadingState"
    >
        <template #control>
            <template v-if="multiple">
                <div
                    v-for="item in selected"
                    :key="item[nodeKey]"
                >
                    {{ formatLabel(selected) }}
                </div>
            </template>
            <div v-else-if="selected">
                {{ formatLabel(selected) }}
            </div>
        </template>
        <template #append>
            <q-icon
                v-if="required === true"
                size="xs"
                name="r_star_border"
                color="red"
            />
        </template>
        <q-menu
            fit
            class="shadow-10"
        >
            <div
                class="flex column"
                style="height: 350px;min-width: 300px;"
            >
                <XTree
                    ref="xTree"
                    v-bind="$attrs"
                    default-expand-all

                    :data-source="nodes"
                    :node-key="nodeKey"
                    :label-key="labelKey"
                    :default-value="getSelectedValue"
                    :multiple="multiple"

                    @update:ticked="updateTicked"
                    @update:selected="updateSelected"
                >
                    <template #default-header="prop">
                        <div class="row items-center">
                            <div>{{ formatLabel && formatLabel(prop.node) }}</div>
                        </div>
                    </template>
                    <template #refresh>
                        <q-btn
                            color="primary"
                            flat
                            dense
                            round
                            icon="refresh"
                            @click="init"
                        >
                            <q-tooltip>
                                刷新
                            </q-tooltip>
                        </q-btn>
                    </template>
                </XTree>
            </div>
        </q-menu>
    </q-field>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { QTreeNode } from 'quasar';
import { BaseFunction, XTree } from '@/components';

interface InputTreeProps {
    api?: (prams: any) => Promise<any>,
    search?: any,
    defaultValue?: any,
    nodeKey?: string,
    labelKey?: string,
    multiple?: boolean,
    resultKey?: string,

    format?: BaseFunction,

    required?: boolean,
    modelValue: any,
    componentsProps?: any
}

const props = withDefaults(defineProps<InputTreeProps>(), {
    multiple: false,
    resultKey: 'list',
    nodeKey: 'ID',
    labelKey: 'label',
    search: {},
    required: false,
    format: undefined,
    defaultValue: undefined,
    api: undefined,

    componentsProps: null,
});
const emit = defineEmits(['update:modelValue', 'update:selected', 'update:ticked']);

const xTree = ref<any | null>(null);
const nodes = ref<any[]>([]);
const loadingState = ref(false);
const selected = ref<any>();

const getSelectedValue = computed(
    () => (props.multiple
        ? selected.value.map((item: any) => item[props.nodeKey]) : selected.value?.[props.nodeKey]),
);
const showClear = computed(
    () => (props.multiple && selected.value.length > 0) || (!props.multiple && selected.value),
);

const updateSelected = (value: any) => {
    if (props.multiple) return;
    const node = xTree.value?.treeRef.getNodeByKey(value);
    selected.value = node;

    emit('update:selected', value);
};
const updateTicked = (value: any) => {
    if (!props.multiple) return;

    selected.value = [];
    value.forEach((key: any) => {
        const node = xTree.value?.treeRef.getNodeByKey(key);
        selected.value.push(node);
    });

    emit('update:ticked', value);
};
const getSelected = (key: any, list: any[]) => {
    try {
        list.forEach((item) => {
            if (item[props.nodeKey] == key) {
                if (props.multiple) {
                    selected.value.push(item);
                } else {
                    selected.value = item;
                }
                throw new Error('find one');
            }
            if (item.children) getSelected(key, item.children);
        });
    } catch (e) {
        console.log('退出foreach');
    }
};

const initSelected = () => {
    selected.value = props.multiple ? [] : null;
};
const setDefaultValue = () => {
    const val = props.modelValue || props.defaultValue;
    if (val && val !== 0) {
        if (props.multiple) {
            val.forEach((key: any) => {
                getSelected(key, nodes.value);
            });
        } else {
            getSelected(val, nodes.value);
        }
    } else {
        initSelected();
    }
};
const formatLabel = (node: QTreeNode) => {
    if (typeof props.format === 'function') return props.format(node);
    return node[props.labelKey];
};

watch(props, (value) => {
    if (props.modelValue !== selected.value) {
        setDefaultValue();
    }
}, { deep: true });
watch(selected, () => {
    let value = null;
    if (props.multiple) {
        value = selected.value.map((item: any) => item[props.nodeKey]);
    } else {
        value = selected.value?.[props.nodeKey];
    }

    emit('update:modelValue', value);
}, { immediate: true });

const init = async () => {
    initSelected();

    // 加在数据
    if (typeof props.api === 'function') {
        loadingState.value = true;
        const result = await props.api(props.search.value);
        nodes.value = result[props.resultKey] || [];
        loadingState.value = false;
    }

    setDefaultValue();
};
init();
</script>
<script lang="ts">
export default {
    name: 'XInputTree',
};
</script>

<style scoped lang="sass">
</style>
