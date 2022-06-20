<template>
    <q-page-sticky
        position="top"
        expand
        class="shadow-5"
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
                            content-class="q-gutter-x-sm"
                        >
                            <q-icon
                                size="18px"
                                :name="navTab?.meta?.icon||'lightbulb'"
                            />
                            <div class="text-caption">
                                {{ navTab?.meta?.title }}
                            </div>
                            <q-btn
                                v-if="navTab?.meta?.closeTab != false"
                                color="red"
                                flat
                                round
                                dense
                                size="xs"
                                @click.stop="closeNavTab(navTab.path)"
                            >
                                <q-icon
                                    name="close"
                                    color="deep-orange"
                                />
                            </q-btn>
                            <q-menu
                                fit
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
                                                    size="20px"
                                                    color="red"
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
                                                size="20px"
                                                color="red"
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
                                                size="20px"
                                                color="red"
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
                        color="primary"
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
                        color="primary"
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
                        color="primary"
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
        height: 3px !important

    min-height: v-bind(navHeight)

    .tab
        padding: 0 10px
        min-height: v-bind(navHeight) !important
    .tabs
        height: v-bind(navHeight)

.body--light
    .nav-tabs
        background-color: $grey-2

        .active
            color: $primary
            background-color: white

        .tabs
            color: $grey-9

.body--dark
    .nav-tabs
        background-color: $dark

        .active
            color: white
            background-color: rgba($primary, 0.1)

        .tabs
            color: white
</style>
