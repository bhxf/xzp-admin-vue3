<template>
    <div
        class="content rounded-borders"
    >
        <slot v-bind="{pageHeight:getHeight}" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useLayoutStore from '@/store/settings/layout';

const getHeight = computed(() => useLayoutStore().getPageHeight);
</script>
<script lang="ts">
export default {
    name: 'DefaultContent',
};
</script>

<style scoped lang="sass">
.content
    margin-left: 12px
    margin-right: 12px
.body--light
    .content
        background: white
.body--dark
    .content
        background: $dark
</style>
