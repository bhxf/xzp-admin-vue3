<template>
    <q-menu class="open-menu shadow-10">
        <div
            class="flex column"
        >
            <div class="q-pa-sm">
                <q-input
                    v-model="filter"
                    rounded
                    standout
                    dense
                    class="full-width"
                    placeholder="请输入菜单名称"
                >
                    <template #append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>
            <q-list
                padding
                dense
            >
                <q-item
                    v-for="item in getNavData"
                    :key="item.name"
                    dense
                    clickable
                >
                    <q-item-section>
                        <div class="row no-wrap items-center q-gutter-x-sm">
                            <q-icon
                                size="20px"
                                :name="item.meta?.icon"
                            />
                            <q-item-label lines="1">
                                {{ item.meta?.title }}
                            </q-item-label>
                        </div>
                    </q-item-section>

                    <q-item-section side>
                        <div>
                            <q-btn
                                color="pink-6"
                                flat
                                dense
                                round
                                size="sm"
                                :icon="item.meta?.collect?'r_favorite':'favorite_border'"
                                @click.stop="onCollect(item)"
                            >
                                <q-tooltip>{{ item.meta?.collect ? '取消收藏' : '收藏' }}</q-tooltip>
                            </q-btn>
                            <q-btn
                                v-if="!item.children||item.children?.length===0"
                                color="primary"
                                flat
                                dense
                                round
                                size="sm"
                                icon="r_redo"
                                @click.stop="onAddNavTab(item)"
                            >
                                <q-tooltip>打开该标签</q-tooltip>
                            </q-btn>
                            <q-icon
                                v-if="item.children&&item.children?.length>0"
                                size="sm"
                                name="r_chevron_right"
                            />
                        </div>
                    </q-item-section>

                    <x-cascade
                        v-if="item.children && item.children?.length>0"

                        anchor="top right"
                        self="top left"
                        item-key="name"
                        :data-source="item.children"
                    >
                        <template #item="sub">
                            <q-item-section>
                                <div class="row no-wrap items-center q-gutter-x-sm">
                                    <q-icon
                                        size="20px"
                                        :name="sub.meta?.icon"
                                    />
                                    <q-item-label lines="1">
                                        {{ sub.meta?.title }}
                                    </q-item-label>
                                </div>
                            </q-item-section>

                            <q-item-section side>
                                <div>
                                    <q-btn
                                        color="pink-6"
                                        flat
                                        dense
                                        round
                                        size="sm"
                                        :icon="sub.meta?.collect?'r_favorite':'favorite_border'"
                                        @click.stop="onCollect(sub)"
                                    >
                                        <q-tooltip>{{ sub.meta?.collect ? '取消收藏' : '收藏' }}</q-tooltip>
                                    </q-btn>
                                    <q-btn
                                        v-if="!sub.children||sub.children.length===0"
                                        color="primary"
                                        flat
                                        dense
                                        round
                                        size="sm"
                                        icon="r_redo"
                                        @click.stop="onAddNavTab(sub)"
                                    >
                                        <q-tooltip>打开该标签</q-tooltip>
                                    </q-btn>
                                </div>
                            </q-item-section>
                        </template>
                    </x-cascade>
                </q-item>
            </q-list>
        </div>
    </q-menu>
</template>

<script setup lang="ts">
import { NavTab, useNavTabStore } from '@/store/settings/navigation';
import { computed, ref } from 'vue';
import XCascade from '@/components/XCascade/index.vue';
import { useRouter } from '@/plugins/router';

const filter = ref<string>('');

const navTabStore = useNavTabStore();
const allNavTabs = computed(() => navTabStore.allNavTabs);
const allNavTabList = computed(() => navTabStore.getAllNavTabList);

const onAddNavTab = (nav: NavTab) => {
    useRouter.push({ path: nav.path as string });
    navTabStore.openMenu = false;
};
const onCollect = (nav: NavTab) => {
    navTabStore.updateCollectNavTabs(nav);
};

const getNavData = computed(() => {
    if (filter.value) {
        return allNavTabList.value.filter((item) => item?.meta?.title.indexOf(filter.value) !== -1);
    }

    return allNavTabs.value;
});
</script>
<script lang="ts">
export default {
    name: 'OpenMenu',
};
</script>

<style scoped lang="sass">
.body--dark
    .open-menu
        background: $grey-10

.body--light
    .open-menu
        background: white

</style>
