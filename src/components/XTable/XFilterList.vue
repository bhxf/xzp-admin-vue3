<template>
    <div class="column">
        <div class="row q-gutter-sm q-pa-sm items-center justify-start col-auto">
            <q-space />
            <q-btn
                dense
                flat
                color="primary"
                icon="r_add"
                label="增加条件"
                @click="onAdd"
            />
            <q-btn
                dense
                flat
                color="primary"
                icon="r_search"
                label="开始查询"
            />
            <q-btn
                dense
                flat
                color="primary"
                icon="r_restart_alt"
                label="重置"
                @click="onReset"
            />
        </div>

        <q-separator />

        <div class="column col items-center full-width q-pa-md q-gutter-y-sm">
            <div
                v-for="(item,index) in getList"
                :key="item.name"
                class="row no-wrap items-stretch q-gutter-x-xs"
            >
                <q-select
                    v-model="item.splicing"
                    style="min-width: 80px;"
                    :options="[{label:'或',value:'or'},{label:'并且',value:'and'}]"
                    standout
                    dense
                    options-dense
                    emit-value
                    map-options
                />
                <q-select
                    v-model="item.name"
                    style="min-width: 150px;"
                    :options="getNames"
                    standout
                    dense
                    options-dense
                    emit-value
                    map-options
                />
                <q-select
                    v-model="item.type"
                    emit-value
                    style="min-width: 100px;"
                    :options="getTypes(item.name)"
                    standout
                    dense
                    options-dense
                    map-options
                />
                <div
                    style="min-width: 200px;"
                    class="row items-center"
                >
                    <slot
                        :name="item.name"
                        v-bind="{item,getList}"
                    >
                        <component
                            class="full-width"
                            :is="getComponents(item.name)"
                            v-model="item.value"
                            v-bind="getComponentsProps(item.name)"
                        />
                    </slot>
                </div>
                <q-btn
                    v-if="getList.length>1"
                    flat
                    dense
                    round
                    color="red"
                    icon="r_close"
                    @click="del(index)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { getComponentsByType } from '@/components/XTable/index';
import { computed, ref } from 'vue';
import { getComponentsByName, ResultColumn, SearchColumn } from '@/components';

interface Props {
    filterList?: SearchColumn[],
}

const props = withDefaults(defineProps<Props>(), { filterList: () => [] });

const emit = defineEmits(['onSearch']);

const keyword = ref<string>('');
const list = ref<ResultColumn[]>([]);
if (props.filterList.length > 0) {
    list.value.push({
        name: props.filterList[0].name,
        value: props.filterList[0].value,
        type: '=',
        splicing: 'and',
    });
}

const defaultComponentsProps = {
    dense: true,
    standout: '',
    lazyRules: false,
    rules: <any>[],
};
const newfilterList = ref<SearchColumn[]>(JSON.parse(JSON.stringify(props.filterList)));
newfilterList.value.forEach((item) => {
    item.components = getComponentsByName(item.components || 'input');
    item.componentsProps = { ...defaultComponentsProps, ...item.componentsProps };
});

const getNames = computed(
    () => newfilterList.value.map((item) => ({ label: item.label, value: item.name })),
);

const getTypes = computed(() => (name: string) => {
    const components = props.filterList.find((item) => item.name === name);
    return getComponentsByType(components?.components || '');
});

const getComponents = computed(() => (name: string) => {
    const components = newfilterList.value.find((item) => item.name === name);
    if (!components) return getComponentsByName('input');
    return components.components;
});
const getComponentsProps = computed(() => (name: string) => {
    const components = newfilterList.value.find((item) => item.name === name);
    if (!components) return defaultComponentsProps;
    return components?.componentsProps || {};
});

const getList = computed(() => {
    if (keyword.value) return list.value.filter((item) => item.name?.indexOf(keyword.value) !== -1);
    return list.value;
});

const onAdd = () => {
    list.value.unshift({ name: '', value: null, type: '=' });
};
const del = (index: number) => {
    list.value.splice(index, 1);
};
const onSearch = () => {
    emit('onSearch', list.value);
};
const onReset = () => {
    list.value = [{ name: '', value: null, type: '=' }];
};

</script>
<script lang="ts">
export default {
    name: 'XFilterList',
};
</script>

<style scoped lang="less">
</style>
