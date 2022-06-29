<template>
    <q-menu
        v-model="openCardMenu"
        fit
        class="layout-shadow-up"
        context-menu
        transition-show="jump-down"
        transition-hide="jump-up"
    >
        <div
            style="min-height: 100px;max-height: 900px;"
            class="row q-gutter-y-md  q-mr-xl q-pl-xl"
        >
            <div
                v-for="item in list"
                :key="item.path"
                class="column q-gutter-y-sm col-2 q-gutter-y-sm"
            >
                <div
                    class="title row q-gutter-x-sm items-center text-subtitle2 text-weight-medium q-mt-lg"
                    @click="onJump(item)"
                >
                    <q-icon
                        size="sm"
                        :name="item?.meta?.icon"
                    />
                    <div>{{ item?.meta?.title }}</div>
                </div>
                <template v-if="item.children && item.children?.length > 0">
                    <div
                        v-for="sub in item.children"
                        :key="sub.path"
                        style="padding-left: 32px;"
                        class="title-sub text-caption"
                        @click="onJump(sub)"
                    >
                        <div>{{ sub?.meta?.title }}</div>
                    </div>
                </template>
            </div>
        </div>
    </q-menu>
</template>

<script setup lang="ts">
import { NavTab, useNavTabStore } from '@/store/settings/navigation';
import { computed } from 'vue';
import useLayoutStore from '@/store/settings/layout';
import { useRouter } from '@/plugins/router';

const layoutStore = useLayoutStore();
const openCardMenu = computed({
    get() {
        return layoutStore.openCardMenu;
    },
    set(value:boolean) {
        layoutStore.openCardMenu = value;
    },
});
const list = computed(() => useNavTabStore().openCardMenus);
const onJump = (tab:NavTab) => {
    if (tab.children && tab.children.length > 0) return;
    useRouter.push({ path: tab.path as string });
};
</script>
<script lang="ts">
export default {
    name: 'CardMenu',
};
</script>

<style scoped lang="sass">
.title:hover
    color: $primary
    cursor: pointer
.title-sub:hover
    color: $primary
    cursor: pointer

.body--light
    .card-menu
        background: white
        .title
           color: $grey-10
        .title-sub
            color:  $grey-9

.body--dark
    .card-menu
        background: $grey-10
        .title
            color: white
        .title-sub
            color: white
</style>
