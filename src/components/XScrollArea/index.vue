<template>
    <q-scroll-area
        v-bind="$attrs"
        ref="scrollAreaRef"
        class="col"
    >
        <slot/>
    </q-scroll-area>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {QScrollArea} from "quasar";

const scrollAreaRef = ref<QScrollArea|null>(null)

defineExpose({scrollAreaRef:scrollAreaRef})
</script>
<script lang="ts">
export default {
    name: "XScrollArea",
};
</script>

<style scoped lang="sass">
</style>
