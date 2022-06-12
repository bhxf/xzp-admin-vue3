<template>
  <div class="flex column col q-gutter-y-xs">
    <div class="tools flex column col-auto q-gutter-y-xs">
      <div class="q-pl-sm q-pr-sm q-pt-xs">
        <slot
          name="tools"
          v-bind="{ticked,selected}"
        />
      </div>

      <div class="row no-wrap q-pl-sm q-pr-sm items-center q-gutter-x-xs">
        <q-input
          v-model="search[keyword]"
          class="col"
          rounded
          standout
          dense
          placeholder="请输入关键字"
          @keyup.enter="loadData"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space />

        <q-btn
          color="primary"
          flat
          dense
          round
          icon="refresh"
          @click="loadData"
        />
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
      <q-list v-else>
        <template
          v-for="item in list"
          :key="item[nameKey]"
        >
          <q-item
            v-ripple
            clickable
            :active="active === item[nameKey]"
            active-class="x-active-item"
            @click="onClickItem(item)"
          >
            <slot
              name="item"
              :item="item"
            >
              <q-item-section>
                <q-item-label>
                  {{ item[labelKey] }}
                </q-item-label>
              </q-item-section>
            </slot>
          </q-item>
        </template>
      </q-list>
    </x-scroll-area>

    <q-separator />

    <div class="flex justify-center">
      <q-pagination
        v-model="paginationModal.page"
        :max="paginationModal.totalPage"
        input
        @update:model-value="(page)=>{
          loadData({page})
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import XScrollArea from '@/components/XScrollArea/index.vue';

interface ListProps {
    dataSource?: any[],
    api?: ((prams: any) => Promise<any>)|undefined,
    search?: any,
    defaultValue?: any,
    hidePagination?: boolean,
    multiple?: boolean,
    resultKey?: string,
    labelKey?: string,
    nameKey?: string,
    pageSize?: number,
    pagination?: any,
    keyword?: string,
}

const props = withDefaults(defineProps<ListProps>(), {
  hidePagination: false,
  multiple: false,
  resultKey: 'list',
  search: {},
  labelKey: 'label',
  nameKey: 'name',
  keyword: 'keyword',
  dataSource: () => [],
  defaultValue: null,
  api: undefined,
  pagination: {
    page: 'page',
    pageSize: 'pageSize',
    total: 'total',
  },
  pageSize: 25,
});
const emit = defineEmits(['update:selected']);

const paginationModal = ref({
  page: 0,
  totalPage: 0,
});
const list = ref<any[]>([]);
const search = ref<any>({});
const ticked = ref([]);
const selected = ref(null);
const active = ref('');
const loading = ref<boolean>(false);

const onClickItem = (item: any) => {
  const key = item[props.nameKey];
  active.value = key;
  emit('update:selected', key);
};
const loadData = async (params?: any) => {
  if (typeof props.api === 'function') {
    loading.value = true;

    search.value = Object.assign(search.value, params);
    const result = await props.api(search.value);
    list.value = result[props.resultKey] || [];

    if (!props.hidePagination) {
      paginationModal.value.page = result[props.pagination.page];
      const pageSize = parseInt(result[props.pagination.pageSize], 10);
      const total = parseInt(result[props.pagination.total], 10);
      paginationModal.value.totalPage = Math.floor((total + pageSize - 1) / pageSize);
    }

    loading.value = false;
  } else {
    list.value = props.dataSource;
  }
};

const init = () => {
  if (!props.hidePagination) {
    search.value.page = 1;
    search.value.pageSize = props.pageSize;
  }

  loadData();
};

init();

defineExpose({ loadData });

</script>
<script lang="ts">
export default {
  name: 'XList',
};
</script>

<style scoped lang="sass">
.body--light
    .x-active-item
        color: $primary
        background: rgb($primary, 0.1)
        font-weight: bolder

.body--dark
    .x-active-item
        color: $primary
        background: rgb($primary, 0.1)
        font-weight: bolder
</style>
