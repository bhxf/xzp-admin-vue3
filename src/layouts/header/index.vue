<template>
    <q-header>
        <div class="layout-header items-center row no-wrap full-width q-gutter-x-sm">
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

                <q-toggle
                    v-model="themMode"
                    color="amber"
                    checked-icon="dark_mode"
                    unchecked-icon="light_mode"
                />

                <q-btn
                    color="primary"
                    outline
                    dense
                    rounded
                >
                    <q-badge
                        color="red"
                        rounded
                        floating
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
                        transition-show="flip-right"
                        transition-hide="flip-left"
                    >
                        <div class="row no-wrap q-pa-md">
                            <div
                                class="column q-gutter-y-xs"
                                style="min-width: 150px;"
                            >
                                <div class="text-h6 q-mb-md">
                                    个人设置
                                </div>
                                <q-select
                                    v-model="role"
                                    standout
                                    dense
                                    label="当前角色"
                                />
                                <q-select
                                    v-model="dept"
                                    standout
                                    dense
                                    label="当前部门"
                                />
                            </div>

                            <q-separator
                                vertical
                                inset
                                class="q-mx-lg"
                            />

                            <div class="column items-center">
                                <q-avatar size="72px">
                                    <img :src="baseStore.user?.headerImg">
                                </q-avatar>

                                <div class="text-subtitle1 q-mt-md q-mb-xs">
                                    {{ baseStore.user?.userName }}
                                </div>

                                <q-btn
                                    v-close-popup
                                    color="primary"
                                    label="退出"
                                    push
                                    size="sm"
                                    @click="baseStore.handlerLogout"
                                />
                            </div>
                        </div>
                    </q-menu>
                </q-btn>
            </div>
        </div>
    </q-header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref, watch } from 'vue';
import CollectTabs from '@/layouts/navigation/CollectTabs.vue';
import { useBaseStore } from '@/store/system/base';
import useLayoutStore from '@/store/settings/layout';

const $q = useQuasar();
const baseStore = useBaseStore();
const themMode = ref(false);
const role = ref('');
const dept = ref('');

watch(themMode, () => {
    handleDark();
});
const handleDark = () => {
    $q.dark.toggle();
};
const headerHeight = computed(() => `${useLayoutStore().headerHeight}px`);

</script>
<script lang="ts">
export default {
    name: 'LayoutHeader',
};
</script>

<style scoped lang="sass">
.layout-header
    height: v-bind(headerHeight)

.body--dark
    .layout-header
        background-color: $dark
        color: white

.body--light
    .layout-header
        background-color: white
        color: $grey-9
</style>
