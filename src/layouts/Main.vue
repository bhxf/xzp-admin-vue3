<template>
    <q-layout
        view="hHh Lpr lff"
        class="shadow-2 rounded-borders"
    >
        <layout-header />
        <layout-navigation />
        <layout-content />
    </q-layout>
</template>

<script setup lang="ts">
import LayoutHeader from './header/index.vue';
import LayoutNavigation from './navigation/index.vue';
import LayoutContent from './content/index.vue';
</script>
<script lang="ts">
export default {
    name: 'LayoutMain',
};
</script>
<style scoped lang="less">
</style>
