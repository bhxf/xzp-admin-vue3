<template>
    <div
        class="flex column"
    >
        <x-form-area
            ref="formAreaRef"
            :form-areas="formAreas"
        >
            <template #baseAction>
                <q-btn
                    :loading="loadings['saveBase']"
                    round
                    flat
                    icon="save"
                    color="primary"
                    @click="onSaveBase"
                >
                    <q-tooltip>保存基本信息</q-tooltip>
                </q-btn>
                <q-btn
                    round
                    flat
                    icon="refresh"
                    color="primary"
                    @click="loadBase"
                >
                    <q-tooltip>刷新</q-tooltip>
                </q-btn>
            </template>
            <template #menuAuthAction>
                <q-btn
                    :loading="loadings['saveMenu']"
                    round
                    flat
                    icon="save"
                    color="primary"
                    @click="onSaveMenu"
                >
                    <q-tooltip>保存菜单信息</q-tooltip>
                </q-btn>
                <q-btn
                    round
                    flat
                    icon="refresh"
                    color="primary"
                    @click="loadMenu"
                >
                    <q-tooltip>刷新</q-tooltip>
                </q-btn>
            </template>
            <template #apiAuthAction>
                <q-btn
                    :loading="loadings['saveApi']"
                    round
                    flat
                    icon="save"
                    color="primary"
                    @click="onSaveApi"
                >
                    <q-tooltip>保存API信息</q-tooltip>
                </q-btn>
                <q-btn
                    round
                    flat
                    icon="refresh"
                    color="primary"
                    @click="loadApi"
                >
                    <q-tooltip>刷新</q-tooltip>
                </q-btn>
            </template>

            <template #base>
                <x-form
                    ref="formRef"
                    :fields="roleFormAreas"
                />
                <q-inner-loading
                    :showing="loadings['base']"
                    color="primary"
                    label="正在加载信息"
                    label-class="text-teal"
                    label-style="font-size: 1.1em"
                />
            </template>
            <template #menuAuth>
                <div
                    style="height: 350px"
                    class="flex column"
                >
                    <x-tree
                        ref="menuTreeRef"
                        :api="getMenuList"
                        :format-label="(node:any)=>node?.meta?.title"
                        result-key="list"

                        tick-strategy="leaf"
                        node-key="ID"
                        @update:ticked="updateMenuTicked"
                    >
                        <template #default-header="prop">
                            <div class="row items-center">
                                <div>{{ prop.node.meta?.title }}</div>
                            </div>
                        </template>
                    </x-tree>
                </div>
                <q-inner-loading
                    :showing="loadings['menu']"
                    color="primary"
                    label="正在加载信息"
                    label-class="text-teal"
                    label-style="font-size: 1.1em"
                />
            </template>
            <template #apiAuth>
                <div
                    style="height: 450px"
                    class="flex column"
                >
                    <x-tree
                        ref="apiTreeRef"
                        node-key="ID"
                        tick-strategy="leaf"
                        label-key="description"

                        :data-source="apiData"
                        @update:ticked="updateApiTicked"
                    />
                </div>
                <q-inner-loading
                    :showing="loadings['api']"
                    color="primary"
                    label="正在加载信息"
                    label-class="text-teal"
                    label-style="font-size: 1.1em"
                />
            </template>

            <template #loading>
                <q-inner-loading
                    :showing="existAuthorityId"
                    color="primary"
                >
                    <div class="flex justify-center items-center q-gutter-x-sm">
                        <q-icon
                            color="red"
                            size="40px"
                            name="warning_amber"
                        />
                        <div class="text-h5 text-red">
                            未选中角色
                        </div>
                    </div>
                </q-inner-loading>
            </template>
        </x-form-area>
    </div>
</template>

<script setup lang="ts">
import { roleFormAreas } from '@/views/admin/role/data';
import { actionLoading, actionRef } from '@/tools/action/curd';
import { addMenuAuthority, getMenuAuthority, getMenuList } from '@/api/system/menu';
import XTree from '@/components/XTree/index.vue';
import XFormArea from '@/components/XFormArea/index.vue';
import XForm from '@/components/XForm/index.vue';
import { findAuthority, updateAuthority } from '@/api/system/role';
import { computed, ref } from 'vue';
import { getAllApis, getPolicyPathByAuthorityId } from '@/api/system/api';
import { notify } from '@/hooks/message';
import { updateCasbin } from '@/api/system/casbin';
import { TreeRef } from '@/components';

interface Props {
    authId: any
}

withDefaults(defineProps<Props>(), {});
const formAreas = [
    { label: '基本信息', name: 'base' },
    { label: '菜单权限', name: 'menuAuth' },
    { label: 'API权限', name: 'apiAuth' },
];

const { loadings } = actionLoading('base', 'api', 'saveBase', 'saveApi', 'saveMenu');
const { formRef, formAreaRef } = actionRef();
const apiTreeRef = ref<TreeRef | null>(null);
const menuTreeRef = ref<TreeRef | null>(null);
const authorityId = ref<any>();
const apiData = ref<any[]>([]);
const apiTicked = ref<any[]>([]);
const menuTicked = ref<any[]>([]);

const existAuthorityId = computed(() => {
    if (authorityId.value) return false;
    return true;
});

const onSaveBase = async () => {
    const bool = await formRef.value?.getFormRef.validate();
    if (bool) {
        try {
            loadings.value.saveBase = true;
            const info = formRef.value?.formInfo;
            if (!info.parentId) info.parentId = '0';
            await updateAuthority(info);
            notify.success('基本信息保存成功');
        } finally {
            loadings.value.saveBase = false;
        }
    }
};
const onSaveApi = async () => {
    try {
        loadings.value.saveApi = true;
        const apis = apiTicked.value.map((item:any) => ({ path: item.split(' ')[1], method: item.split(' ')[0] }));
        await updateCasbin({ authorityId: authorityId.value, casbinInfos: apis });
        notify.success('API权限保存成功');
    } finally {
        loadings.value.saveApi = false;
    }
};
const onSaveMenu = async () => {
    try {
        loadings.value.saveMenu = true;
        const menus = menuTicked.value.map((item:any) => ({ ID: item }));
        await addMenuAuthority({ authorityId: authorityId.value, menus });
        notify.success('菜单权限保存成功');
    } finally {
        loadings.value.saveMenu = false;
    }
};

const updateApiTicked = (ticked:any[]) => {
    apiTicked.value = ticked;
};
const updateMenuTicked = (ticked:any[]) => {
    menuTicked.value = ticked;
};

const loadBase = async () => {
    loadings.value.base = true;
    const { authority } = await findAuthority({ authorityId: authorityId.value });
    formRef.value?.updateObj(authority);
    loadings.value.base = false;
};
const loadApi = async () => {
    loadings.value.api = true;
    const { paths } = await getPolicyPathByAuthorityId({ authorityId: authorityId.value });
    apiTicked.value = paths.map((item:any) => `${item.method} ${item.path}`);
    apiTreeRef.value?.updateTicked(apiTicked.value);
    loadings.value.api = false;
};
const loadMenu = async () => {
    loadings.value.menu = true;
    const { menus } = await getMenuAuthority({ authorityId: authorityId.value });
    menuTicked.value = menus.map((item:any) => item.ID);
    menuTreeRef.value?.updateTicked(menuTicked.value);
    loadings.value.menu = false;
};
const initApiData = async () => {
    const { apis } = await getAllApis();
    apis.forEach((item: any) => {
        const api = apiData.value.find((sub: any) => sub.ID === item.apiGroup);
        if (!api) {
            let children = apis.filter((sub: any) => sub.apiGroup === item.apiGroup);
            children = children.map((sub:any) => ({
                ID: `${sub.method} ${sub.path}`,
                description: sub.description,
            }));
            const parent = {
                ID: item.apiGroup,
                description: item.apiGroup,
                children,
            };
            apiData.value.push(parent);
        }
    });
};
const loadData = (id: any) => {
    authorityId.value = id;
    if (!id) {
        formRef.value?.clear();
        apiTreeRef.value?.updateTicked([]);
        menuTreeRef.value?.updateTicked([]);
    } else {
        loadBase();
        loadApi();
        loadMenu();
    }
};

initApiData();
defineExpose({ loadData });

</script>
<script lang="ts">
export default {
    name: 'RoleDetail',
};
</script>

<style scoped lang="less">
</style>
