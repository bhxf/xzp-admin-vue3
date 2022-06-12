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

          :api="getMenuList"
          result-key="list"
          tick-strategy="leaf"
          node-key="ID"
          label-key="meta.title"

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
          <template #default-header="prop">
            <div class="row items-center">
              <div>{{ prop.node.meta?.title }}</div>
            </div>
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
      <x-table
        ref="tableRef"
        v-model:selected="tableSelected"

        :hide-pagination="true"

        :height="getHeight"
        :columns="menuColumns"

        :api="getBaseMenuByParentId"
        :search="search"
        :btn-list="btnList"
        :search-list="searchList"

        edit="row"
        row-key="name"
        result-key="menus"
      />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import XTable from '@/components/XTable/index.vue';
import XTree from '@/components/XTree/index.vue';
import XForm from '@/components/XForm/index.vue';
import { menuColumns, menuForm } from '@/views/admin/menu/data';
import {
  addMenu, getMenuList, getBaseMenuById, getBaseMenuByParentId, updateMenu, deleteMenu,
} from '@/api/system/menu';
import { dialog, notify } from '@/hooks/message';
import XDialog from '@/components/XDialog/index.vue';
import { useLayoutStore } from '@/store/settings/layout';
import {
  actionCondition, actionConst, actionLoading, actionRef, actionTitle,
} from '@/tools/action/curd';
import { SearchColumn } from '@/components';

const btnList = [
  { icon: 'o_add', tooltip: 'primary' },
  { icon: 'o_edit', tooltip: 'amber-10' },
  { icon: 'o_delete_outline', tooltip: 'red' },
];
const { action, getTitle } = actionTitle('角色');
const { formRef, tableRef, treeRef } = actionRef();
const { loadings } = actionLoading('add', 'save');
const {
  search, tableSelected, treeSelected, treeTicked,
} = actionConst();
const { isEdit, isDel } = actionCondition(treeSelected, treeTicked);

const updateSelected = (value: any) => {
  treeSelected.value = value;
  tableRef.value?.loadData({ id: value?.toString() });
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
      info.meta = {};
      info.meta.title = info.title;
      info.meta.icon = info.icon;
      info.meta.keepAlive = info.keepAlive;
      info.meta.closeTab = info.closeTab;

      if (action.value === 'add') await addMenu(info);
      else await updateMenu(info);

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
  action.value = 'edit';
  const { menu } = await getBaseMenuById({ id: treeSelected.value || treeTicked.value[0].ID });
  loadings.value.add = true;
  await nextTick();
  const detail: any = menu;
  detail.icon = menu.meta?.icon;
  detail.title = menu.meta?.title;
  detail.keepAlive = menu.meta?.keepAlive;
  detail.closeTab = menu.meta?.closeTab;
  formRef.value?.updateObj(detail);
};
const onDel = async () => {
  dialog.confirm('操作提示', '你确定要删除吗？', async () => {
    await deleteMenu({ id: treeSelected.value });
    notify.success('删除成功');
    treeRef.value?.loadData();
  }, () => {
  });
};

const initMenuForm = computed(() => {
  menuForm.forEach((item) => {
    if (item.name === 'parentId') {
      item.defaultValue = treeSelected.value;
    }
  });

  return menuForm;
});
const searchList: SearchColumn[] = [
  {
    label: 'test', name: 'test1', value: '', components: 'select',
  },
  {
    label: 'test2', name: 'test2', value: '', components: 'input',
  },
  {
    label: 'test4', name: 'test4', value: '', components: 'select',
  },
];

const splitterModel = ref(250);
const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));

</script>
<script lang="ts">
export default {
  name: 'AdminMenu',
};
</script>

<style scoped lang="sass">
</style>
