<template>
    <q-page-container>
        <q-page class="layout-page" padding>

            <q-inner-loading
                :showing="reload"
                color="primary"
                label="菜单加载中..."
                label-class="text-primary"
                label-style="font-size: 1.0em"
            />

            <div v-if="!reload" class="content rounded-borders shadow-24">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" :key="$route.name" v-if="$route.meta?.keepAlive === true"/>
                    </keep-alive>
                    <component :is="Component" :key="$route.name" v-if="$route.meta?.keepAlive !== true"/>
                </router-view>
            </div>

            <nav-tabs/>

            <layout-tools/>

        </q-page>
    </q-page-container>
</template>

<script setup lang="ts">
import NavTabs from "@/layouts/navigation/NavTabs.vue";
import {useNavTabStore} from "@/store/settings/navigation";
import {computed} from "vue";
import {useLayoutStore} from "@/store/settings/layout";
import LayoutTools from "@/layouts/tools/index.vue";

const navTabStore = useNavTabStore()
const layoutStore = useLayoutStore()
const reload = computed(() => navTabStore.reload)
const pagePadding = computed(()=>layoutStore.pagePadding+'px')
const pagePaddingRight = computed(()=>(layoutStore.toolsWidth+10)+'px')

</script>
<script lang="ts">
export default {
    name: "LayoutContent",
};
</script>

<style lang="sass" scoped>
.layout-page
    padding-top: v-bind(pagePadding)
    padding-right: v-bind(pagePaddingRight)

.body--light
    .page
        background: $grey-2
    .content
        background: white
.body--dark
    .page
        background: $grey-9
    .content
        background: $dark
</style>
