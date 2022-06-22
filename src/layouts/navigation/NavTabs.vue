<template>
    <q-page-sticky
        expand
        position="top"
        class="shadow-up-5"
    >
        <q-toolbar class="nav-tabs q-pa-none">
            <div class="row no-wrap full-width items-center">
                <div class="col">
                    <q-tabs
                        v-model="active"
                        dense
                        inline-label
                        outside-arrows
                        mobile-arrows
                        align="left"
                        class="tabs"
                        active-class="active"
                        indicator-color="primary"
                    >
                        <q-tab
                            v-for="navTab in currentNavTabs"
                            :key="navTab.path"
                            class="tab"
                            :name="navTab.path"
                            content-class="q-gutter-x-xs"
                        >
                            <q-icon
                                size="sm"
                                :name="navTab?.meta?.icon||'r_lightbulb'"
                            />
                            <div class="text-caption">
                                {{ navTab?.meta?.title }}
                            </div>
                            <q-btn
                                v-if="navTab?.meta?.closeTab !== false"
                                flat
                                round
                                dense
                                size="sm"
                                @click.stop="closeNavTab(navTab.path)"
                            >
                                <q-icon
                                    name="r_close"
                                />
                            </q-btn>
                            <q-menu
                                fit
                                class="shadow-10 text-weight-medium text-grey-8"
                                touch-position
                                context-menu
                                auto-close
                            >
                                <q-list
                                    dense
                                    padding
                                >
                                    <q-item
                                        clickable
                                        @click="navTabStore.closeRight(navTab)"
                                    >
                                        <q-item-section>
                                            <div class="row no-wrap items-center q-gutter-x-sm">
                                                <q-icon
                                                    size="xs"
                                                    name="r_last_page"
                                                />
                                                <q-item-label lines="1">
                                                    关闭右边
                                                </q-item-label>
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                    <q-item
                                        clickable
                                        @click="navTabStore.closeLeft(navTab)"
                                    >
                                        <div class="row no-wrap items-center q-gutter-x-sm">
                                            <q-icon
                                                size="xs"
                                                name="r_first_page"
                                            />
                                            <q-item-label lines="1">
                                                关闭左边
                                            </q-item-label>
                                        </div>
                                    </q-item>
                                    <q-item
                                        clickable
                                        @click="navTabStore.closeAll"
                                    >
                                        <div class="row no-wrap items-center q-gutter-x-sm">
                                            <q-icon
                                                size="xs"
                                                name="r_highlight_off"
                                            />
                                            <q-item-label lines="1">
                                                关闭全部
                                            </q-item-label>
                                        </div>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-tab>
                    </q-tabs>
                </div>
                <div class="col-auto flex justify-start items-center q-gutter-x-xs q-pr-md">
                    <q-btn
                        round
                        flat
                        dense
                    >
                        {{ currentNavTabs.length }}
                        <q-tooltip>
                            打开的菜单数量
                        </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="r_menu"
                        round
                        flat
                        dense
                    >
                        <q-tooltip>
                            用户菜单
                        </q-tooltip>
                        <open-menu />
                    </q-btn>
                    <q-btn
                        :loading="navTabStore.reload"
                        icon="r_refresh"
                        round
                        flat
                        dense
                        @click="navTabStore.reloadNavTab"
                    >
                        <q-tooltip>
                            刷新当前页面
                        </q-tooltip>
                    </q-btn>
                </div>
            </div>
        </q-toolbar>
    </q-page-sticky>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNavTabStore } from '@/store/settings/navigation';
import OpenMenu from '@/layouts/navigation/OpenMenu.vue';
import useLayoutStore from '@/store/settings/layout';
import { useRouter } from '@/plugins/router';

const navTabStore = useNavTabStore();
const active = computed({
    get() {
        return navTabStore.currentNavTab?.path || '';
    },
    set(path: string) {
        useRouter.push({ path });
    },
});
const currentNavTabs = computed(() => navTabStore.currentNavTabs);
const closeNavTab = (path: string) => {
    navTabStore.removeCurrentNavTabById(path);
};
const navHeight = computed(() => `${useLayoutStore().navHeight}px`);

</script>
<script lang="ts">
export default {
    name: 'NavTabs',
};
</script>

<style scoped lang="sass">
.nav-tabs
    ::v-deep(.q-tab__indicator)
        height: 4px !important

    min-height: v-bind(navHeight)

    .tab
        padding: 0 10px
        min-height: v-bind(navHeight) !important
    .tabs
        height: v-bind(navHeight)

.body--light
    .nav-tabs
        background-color: $grey-1

        .active
            color: $primary
            background-color: rgb($primary,0.1)

        .tabs
            color: $grey-9

.body--dark
    .nav-tabs
        background-color: $grey-10

        .active
            color: white
            background-color:  rgb($primary,0.1)

        .tabs
            color: white
</style>
