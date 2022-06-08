<template>
    <div class="collectTabs col">
        <q-tabs
            v-model="active"
            inline-label
            outside-arrows
            mobile-arrows
            align="left"
            class="tabs"
            active-class="active shadow-5"
        >
            <q-tab
                class="tab"
                v-for="collectTab in collectTabs"
                @click="onNavTab(collectTab)"
                :name="collectTab.name"
                :key="collectTab.ID"
                content-class="q-gutter-x-sm"
            >
                <q-icon size="md" :name="collectTab?.meta?.icon||'lightbulb'"/>
                <div class="text-subtitle2">{{ collectTab?.meta?.title }}</div>
                <x-cascade
                    v-if="collectTab.children && collectTab.children.length>0"
                    :data-source="collectTab.children"
                >
                    <template #item="item">
                        <q-item-section @click="onNavTab(item)">
                            <div class="row no-wrap items-center q-gutter-x-sm">
                                <q-icon size="20px" :name="item.meta?.icon"/>
                                <q-item-label lines="1">
                                    {{ item.meta?.title }}
                                </q-item-label>
                            </div>
                        </q-item-section>
                    </template>
                </x-cascade>
            </q-tab>
        </q-tabs>
    </div>
</template>

<script setup lang="ts">
import {NavTab, useNavTabStore} from "@/store/settings/navigation";
import {computed} from "vue";
import XCascade from "@/components/XCascade/index.vue";
import {useLayoutStore} from "@/store/settings/layout";
import {settingsEnum} from "@/tools/http";
import {getCssVar} from "quasar";

const navTabStore = useNavTabStore()
const active = computed({
    get() {
        return navTabStore.collectActive
    },
    set(ID: string) {
        navTabStore.collectActive = ID
        sessionStorage.setItem(settingsEnum.COLLECT_ACTIVE_TAB, ID)
    }
})
const collectTabs = computed(() => {
    const parentTree: NavTab[] = navTabStore.collectNavTabs.filter(item => item.ID == '0')
    const otherTree: NavTab[] = []
    const findNavChildren = (list: NavTab[]) => {
        list.forEach((item: NavTab) => {
            const children = navTabStore.allNavTabs.filter(item => item.parentId == item.ID)
            if (children && children.length > 0) {
                findNavChildren(children)
                item.children = children
            }
        })
    }
    const findOtherParent = () => {
        const list = navTabStore.collectNavTabs.filter(item => item.ID != '0')
        list.forEach(item => {
            const parent = navTabStore.collectNavTabs.find(sub => sub.ID == item.parentId)
            if (!parent) {
                otherTree.push(item)
            }
        })
    }
    findNavChildren(parentTree)
    findOtherParent()
    return [...parentTree, ...otherTree]
})
const onNavTab = (nav: NavTab) => {
    if (nav.children && nav.children.length > 0) return
    navTabStore.currentNavTab = nav
}
const navHeight = computed(() => useLayoutStore().headerHeight - 5 + 'px')
const getPrimary = computed(()=>{
    return getCssVar('primary')
})

</script>
<script lang="ts">
export default {
    name: "CollectTabs",
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
        background: v-bind(getPrimary)
        border-radius: 3px

.body--dark
    .active
        color: white
        background: v-bind(getPrimary)
        border-radius: 3px
</style>
