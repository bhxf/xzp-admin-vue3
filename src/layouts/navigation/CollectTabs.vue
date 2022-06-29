<template>
    <div class="collectTabs col">
        <q-tabs
            v-model="active"
            inline-label
            outside-arrows
            mobile-arrows
            align="left"
            class="tabs"
            active-class="active"
        >
            <q-tab
                v-for="collectTab in collectTabs"
                :key="collectTab.ID"
                class="tab"
                :name="collectTab.name"
                content-class="q-gutter-x-sm"
                @click="onNavTab(collectTab)"
            >
                <q-icon
                    size="sm"
                    :name="collectTab?.meta?.icon||'lightbulb'"
                />
                <div class="text-subtitle2">
                    {{ collectTab?.meta?.title }}
                </div>
            </q-tab>
        </q-tabs>
    </div>
</template>

<script setup lang="ts">
import { NavTab, useNavTabStore } from '@/store/settings/navigation';
import { computed } from 'vue';
import useLayoutStore from '@/store/settings/layout';
import { SettingsEnum } from '@/tools/http';
import { useRouter } from '@/plugins/router';

const navTabStore = useNavTabStore();
const active = computed({
    get() {
        return navTabStore.collectActive;
    },
    set(ID: string) {
        navTabStore.collectActive = ID;
        sessionStorage.setItem(SettingsEnum.COLLECT_ACTIVE_TAB, ID);
    },
});
const collectTabs = computed(() => {
    const parentTree: NavTab[] = navTabStore.collectNavTabs.filter((item) => item.ID == '0');
    const otherTree: NavTab[] = [];
    const findNavChildren = (list: NavTab[]) => {
        list.forEach((item: NavTab) => {
            const children = navTabStore.allNavTabs.filter((item) => item.parentId == item.ID);
            if (children && children.length > 0) {
                findNavChildren(children);
                item.children = children;
            }
        });
    };
    const findOtherParent = () => {
        const list = navTabStore.collectNavTabs.filter((item) => item.ID != '0');
        list.forEach((item) => {
            const parent = navTabStore.collectNavTabs.find((sub) => sub.ID == item.parentId);
            if (!parent) {
                otherTree.push(item);
            }
        });
    };
    findNavChildren(parentTree);
    findOtherParent();
    return [...parentTree, ...otherTree];
});
const onNavTab = (nav: NavTab) => {
    if (nav.children && nav.children.length > 0) {
        useLayoutStore().openCardMenu = true;
        useNavTabStore().openCardMenus = nav.children;
        return;
    }
    useNavTabStore().openCardMenus = [];

    useRouter.push({ path: nav.path as any });
};
const navHeight = computed(() => `${useLayoutStore().headerHeight - 5}px`);

</script>
<script lang="ts">
export default {
    name: 'CollectTabs',
};
</script>

<style scoped lang="sass">
.collectTabs
    ::v-deep(.q-tab__indicator)
        height: 0 !important
    ::v-deep(.q-tab__content)
        min-width: 110px !important

    min-height: v-bind(navHeight)

    .tab
        padding: 0 10px
        min-height: v-bind(navHeight) !important

    .tabs
        height: v-bind(navHeight)

.body--light
    .active
        color: white
        background: $primary
        border-radius: 5px

.body--dark
    .active
        color: white
        background: $primary
        border-radius: 5px
</style>
