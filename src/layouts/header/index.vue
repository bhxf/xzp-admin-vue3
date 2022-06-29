<template>
    <q-header
        class="layout-header"
        bordered
    >
        <div class="layout-header-context items-center row no-wrap full-width q-gutter-x-sm">
            <div class="flex col-auto q-gutter-x-md justify-start items-center q-pl-sm">
                <q-btn
                    rounded
                    flat
                    dense
                >
                    <q-avatar size="36px">
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
                    </q-avatar>
                </q-btn>
            </div>

            <collect-tabs />

            <q-space />

            <div class="flex col-auto justify-center items-center row q-gutter-x-sm q-mr-sm">
                <q-btn
                    flat
                    dense
                    round
                    icon="r_translate"
                />

                <q-btn
                    flat
                    dense
                    round
                    icon="r_restore"
                    :loading="loadings.reset"
                    @click="onResetDictionary"
                >
                    <q-tooltip>刷新字典缓存</q-tooltip>
                </q-btn>

                <q-toggle
                    v-model="themMode"
                    color="amber"
                    checked-icon="dark_mode"
                    unchecked-icon="light_mode"
                />

                <q-btn
                    color="primary"
                    dense
                    rounded
                    flat
                >
                    <q-badge
                        color="red"
                        rounded
                        floating
                        label="10"
                    />
                    <div class="flex q-gutter-x-sm items-center justify-center">
                        <q-avatar size="30px">
                            <img :src="baseStore.user?.headerImg">
                        </q-avatar>

                        <div class="text-weight-bold">
                            {{ baseStore.user?.userName }}
                        </div>
                    </div>

                    <q-menu
                        style="min-width: 250px;"
                    >
                        <q-card
                            class="shadow-10"
                            flat
                        >
                            <q-item>
                                <q-item-section>
                                    <div class="row justify-center items-center justify-around">
                                        <q-btn
                                            flat
                                            round
                                            icon="r_edit"
                                            color="orange"
                                        >
                                            <q-tooltip>修改个人信息</q-tooltip>
                                        </q-btn>
                                        <q-btn round>
                                            <q-avatar size="70px">
                                                <img :src="baseStore.user?.headerImg">
                                            </q-avatar>
                                        </q-btn>
                                        <q-btn
                                            flat
                                            round
                                            icon="r_vpn_key"
                                            color="primary"
                                            @click="onShowUpdatePassword"
                                        >
                                            <q-tooltip>修改密码</q-tooltip>
                                        </q-btn>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="column q-gutter-y-sm">
                                        <q-select
                                            v-model="role"
                                            dense
                                            standout
                                            rounded
                                            :options="baseStore.user?.authorities||[]"
                                            option-value="authorityId"
                                            option-label="authorityName"
                                        >
                                            <template #prepend>
                                                <q-icon name="r_supervised_user_circle" />
                                            </template>
                                        </q-select>
                                        <q-select
                                            v-model="dept"
                                            dense
                                            standout
                                            rounded
                                            map-options
                                            :options="[
                                                {label:'保护心房部门01',value:'1'},
                                                {label:'保护心房部门02',value:'2'},
                                                {label:'保护心房部门03',value:'3'},
                                                {label:'保护心房部门04',value:'4'},
                                            ]"
                                        >
                                            <template #prepend>
                                                <q-icon name="r_corporate_fare" />
                                            </template>
                                        </q-select>
                                        <q-select
                                            v-model="post"
                                            dense
                                            standout
                                            rounded
                                            map-options
                                            :options="[
                                                {label:'保护心房岗位01',value:'1'},
                                                {label:'保护心房岗位02',value:'2'},
                                                {label:'保护心房岗位03',value:'3'},
                                                {label:'保护心房岗位04',value:'4'},
                                            ]"
                                        >
                                            <template #prepend>
                                                <q-icon name="r_recent_actors" />
                                            </template>
                                        </q-select>
                                        <q-btn
                                            unelevated
                                            class="full-width"
                                            color="red"
                                            icon="r_swipe_right_alt"
                                            label="注销账号"
                                            @click="baseStore.handlerLogout"
                                        />
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-card>
                    </q-menu>
                </q-btn>
            </div>
        </div>

        <!--修改密码-->
        <x-dialog
            v-model="showPassword"
            title="修改密码"
        >
            <x-form
                ref="formRef"
                :fields="passwordForm"
            />
            <template #actions>
                <q-btn
                    unelevated
                    label="取消"
                    @click="showPassword=false"
                />
                <q-btn
                    :loading="loadings.updatePassword"
                    unelevated
                    color="primary"
                    label="确认"
                    @click="onUpdatePassword"
                />
            </template>
        </x-dialog>

        <card-menu />
    </q-header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref, watch } from 'vue';
import CollectTabs from '@/layouts/navigation/CollectTabs.vue';
import { resetDictionary, useBaseStore } from '@/store/system/base';
import useLayoutStore from '@/store/settings/layout';
import XDialog from '@/components/XDialog/index.vue';
import XForm from '@/components/XForm/index.vue';
import { Field } from '@/components';
import { actionLoading, actionRef } from '@/tools/action/curd';
import { clone } from 'lodash-es';
import { changePassword } from '@/api/system/user';
import { notify } from '@/hooks/message';
import CardMenu from '@/layouts/navigation/CardMenu.vue';

const $q = useQuasar();
const baseStore = useBaseStore();
const themMode = ref(false);
const showPassword = ref(false);

const { loadings } = actionLoading('updatePassword', 'reset');
const { formRef } = actionRef();

const role = ref(baseStore.user?.authority.authorityName);
const dept = ref('1');
const post = ref('1');

const passwordForm:Field[] = [
    {
        name: 'username',
        defaultValue: baseStore.user?.userName,
        label: '用户名',
        components: 'input',
        required: true,
        componentsProps: {
            rules: [(val: any) => (val && val.length > 0) || ('请输入用户名')],
        },
    },
    {
        name: 'password',
        label: '旧密码',
        components: 'input',
        required: true,
        componentsProps: {
            type: 'password',
            rules: [(val: any) => (val && val.length > 0) || ('请输入旧密码')],
        },
    },
    {
        name: 'newPassword',
        label: '新密码',
        components: 'input',
        required: true,
        componentsProps: {
            type: 'password',
            rules: [(val: any) => (val && val.length > 0) || ('请输入新密码')],
        },
    },
];

watch(themMode, () => {
    handleDark();
});

const onResetDictionary = async () => {
    try {
        loadings.value.reset = true;
        await resetDictionary();
        notify.success('重置字典成功');
    } finally {
        loadings.value.reset = false;
    }
};
const handleDark = () => {
    $q.dark.toggle();
};

const onUpdatePassword = async () => {
    const bool = await formRef.value?.getFormRef.validate();
    if (bool) {
        try {
            loadings.value.updatePassword = true;
            const info = clone(formRef.value?.formInfo);
            await changePassword(info);
            notify.success('密码更新成功');
            showPassword.value = false;
        } finally {
            loadings.value.updatePassword = false;
        }
    }
};
const onShowUpdatePassword = () => {
    showPassword.value = true;
};
const headerHeight = computed(() => `${useLayoutStore().headerHeight}px`);

</script>
<script lang="ts">
export default {
    name: 'LayoutHeader',
};
</script>

<style scoped lang="sass">
.layout-header-context
    height: v-bind(headerHeight)

.body--dark
    .layout-header
        background-color: $dark

    .layout-header-context
        background-color: $dark
        color: white

.body--light
    .layout-header
        background-color: white

    .layout-header-context
        background-color: white
        color: $grey-9
</style>
