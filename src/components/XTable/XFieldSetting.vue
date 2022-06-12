<template>
  <q-menu
    transition-show="jump-down"
    transition-hide="jump-up"
  >
    <div
      style="height: 350px"
      class="flex column"
    >
      <div class="column q-pa-md col-auto">
        <q-input
          v-model="keyword"
          rounded
          standout
          dense
          placeholder="请输入关键字"
        >
          <template #append>
            <q-icon name="search" />
          </template>
          <template #after>
            <q-btn
              v-if="!isAll"
              color="primary"
              flat
              dense
              round
              icon="radio_button_unchecked"
              @click="onCheckAll"
            />
            <q-btn
              v-if="isAll"
              color="primary"
              flat
              dense
              round
              icon="task_alt"
              @click="onUnCheckAll"
            />
          </template>
        </q-input>
      </div>
      <x-scroll-area>
        <q-list dense>
          <q-item
            v-for="item in getNewColumns"
            :key="item.name"
            v-ripple
            tag="label"
            clickable
          >
            <q-item-section side>
              <q-checkbox
                v-model="item.show"
                dense
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ item.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </x-scroll-area>
    </div>
  </q-menu>
</template>

<script setup lang="ts">

import XScrollArea from '@/components/XScrollArea/index.vue';
import {
  computed, inject, Ref, ref,
} from 'vue';
import { Column } from '@/components';

const keyword = ref<string>('');
const newColumns = inject<Ref<Column[]|undefined>>('newColumns');

const getNewColumns = computed(() => {
  if (!keyword.value) return newColumns?.value || [];
  return newColumns?.value
      && newColumns.value.filter((item: any) => (item.label.indexOf(keyword.value) !== -1));
});
const onCheckAll = () => {
  if (newColumns?.value) newColumns.value.forEach((item) => item.show = true);
};
const onUnCheckAll = () => {
  if (newColumns?.value) newColumns.value.forEach((item) => item.show = false);
};
const isAll = computed(() => {
  const check = newColumns?.value && newColumns.value.filter((item) => item.show === true);
  if (!check || check.length === 0) return false;
  const bool = (check.length === (newColumns?.value && newColumns.value.length));
  return bool;
});

</script>
<script lang="ts">
export default {
  name: 'XFieldSetting',
};
</script>

<style scoped lang="less">
</style>
