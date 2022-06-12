<template>
  <q-menu
    transition-show="jump-down"
    transition-hide="jump-up"
  >
    <div
      class="flex column"
      style="height: 400px;width: 550px;"
    >
      <div class="col-auto q-pa-md">
        <q-input
          v-model="keyword"
          placeholder="请输入关键字"
          rounded
          standout
          dense
        >
          <template #append>
            <q-icon name="search" />
          </template>
          <template #after>
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="add"
              @click="onAdd"
            />
          </template>
        </q-input>
      </div>
      <x-scroll-area>
        <q-list
          dense
          padding
        >
          <q-item
            v-for="(item,index) in getList"
            :key="item.name"
            clickable
          >
            <q-item-section>
              <div class="row no-wrap justify-center items-center q-gutter-x-xs">
                <q-select
                  v-model="item.name"
                  class="col"
                  style="min-width: 200px;"
                  :options="getNames"
                  standout
                  dense
                  options-dense
                  emit-value
                  map-options
                />
                <q-select
                  v-model="item.type"
                  class="col"
                  emit-value
                  style="min-width: 120px;"
                  :options="getTypes(item.name)"
                  standout
                  dense
                  options-dense
                  map-options
                />
                <div class="col">
                  <slot
                    :name="item.name"
                    v-bind="{item,getList}"
                  >
                    <component
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
                  icon="o_remove_circle"
                  @click="del(index)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </x-scroll-area>
      <div class="flex justify-center items-center col-auto q-pa-sm">
        <q-btn
          color="primary"
          flat
          rounded
          label="查询"
          icon="search"
          @click="onSearch"
        />
        <q-btn
          color="red"
          flat
          rounded
          label="重置"
          icon="restart_alt"
          @click="onReset"
        />
      </div>
    </div>
  </q-menu>
</template>

<script setup lang="ts">

import { getComponentsByType } from '@/components/XTable/index';
import { computed, ref } from 'vue';
import XScrollArea from '@/components/XScrollArea/index.vue';
import { QInput } from 'quasar';
import { getComponentsByName, ResultColumn, SearchColumn } from '@/components';

interface Props {
    searchList?: SearchColumn[],
}

const props = withDefaults(defineProps<Props>(), { searchList: () => [] });

const emit = defineEmits(['onSearch']);

const keyword = ref<string>('');
const list = ref<ResultColumn[]>([]);
if (props.searchList.length > 0) {
  list.value.push({
    name: props.searchList[0].name,
    value: props.searchList[0].value,
    type: '=',
  });
}

const defaultComponentsProps = {
  dense: true,
  standout: '',
  lazyRules: false,
  rules: <any>[],
};
const newSearchList = ref<SearchColumn[]>(JSON.parse(JSON.stringify(props.searchList)));
newSearchList.value.forEach((item) => {
  item.components = getComponentsByName(item.components || 'input');
  item.componentsProps = { ...defaultComponentsProps, ...item.componentsProps };
});

const getNames = computed(
  () => newSearchList.value.map((item) => ({ label: item.label, value: item.name })),
);

const getTypes = computed(() => (name: string) => {
  const components = props.searchList.find((item) => item.name === name);
  return getComponentsByType(components?.components || '');
});

const getComponents = computed(() => (name: string) => {
  const components = newSearchList.value.find((item) => item.name === name);
  if (!components) return getComponentsByName('input');
  return components.components;
});
const getComponentsProps = computed(() => (name: string) => {
  const components = newSearchList.value.find((item) => item.name === name);
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
  name: 'XSearchForm',
};
</script>

<style scoped lang="less">
</style>
