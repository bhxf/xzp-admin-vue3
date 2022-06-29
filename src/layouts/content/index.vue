<template>
    <q-page-container>
        <q-page
            class="layout-page"
        >
            <div>
                <q-inner-loading
                    :showing="reload"
                    color="primary"
                    label="菜单加载中..."
                    label-class="text-primary"
                    label-style="font-size: 1.0em"
                />
                <router-view v-slot="{ Component }">
                    <keep-alive :include="getKeepAlive">
                        <component
                            :is="Component"
                            v-if="!reload"
                            :key="$route.name"
                        />
                    </keep-alive>
                </router-view>
            </div>

            <nav-tabs />

            <layout-tools />
        </q-page>
    </q-page-container>
</template>

<script setup lang="ts">
import NavTabs from '@/layouts/navigation/NavTabs.vue';
import { useNavTabStore } from '@/store/settings/navigation';
import { computed } from 'vue';
import useLayoutStore from '@/store/settings/layout';
import LayoutTools from '@/layouts/tools/index.vue';

const navTabStore = useNavTabStore();
const layoutStore = useLayoutStore();
const reload = computed(() => navTabStore.reload);
const getKeepAlive = computed(() => {
    const keepAliveList = navTabStore.currentNavTabs.filter((item) => item?.meta?.keepAlive === true);
    return keepAliveList.map((item) => item.name);
});

const pagePadding = computed(() => `${layoutStore.pagePadding}px`);
const pagePaddingRight = computed(() => `${layoutStore.toolsWidth}px`);

</script>
<script lang="ts">
export default {
    name: 'LayoutContent',
};
</script>

<style lang="sass" scoped>
.layout-page
    padding-top: v-bind(pagePadding)
    padding-right: v-bind(pagePaddingRight)

.body--light
    .layout-page
        background: #f1f5f7
    .content
        background: white
.body--dark
    .layout-page
        background: rgb($dark,0.3)
    .content
        background: $dark
</style>
