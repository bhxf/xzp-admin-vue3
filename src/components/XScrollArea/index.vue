<template>
    <q-scroll-area
        v-bind="$attrs"
        ref="scrollAreaRef"
        :class="[isCol?'col':'',scrollLen>0?'tree-inset-shadow':'']"
        @scroll="onScroll"
    >
        <slot />
    </q-scroll-area>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QScrollArea } from 'quasar';

interface Props {
    isCol: boolean
}
withDefaults(defineProps<Props>(), {
    isCol: true,
});

const scrollLen = ref(0);
const scrollAreaRef = ref<QScrollArea|null>(null);

const onScroll = ({ verticalPosition = 0 }) => {
    scrollLen.value = verticalPosition;
};

defineExpose({ scrollAreaRef });
</script>
<script lang="ts">
export default {
    name: 'XScrollArea',
};
</script>

<style scoped lang="sass">
.tree-inset-shadow
    box-shadow: 0 7px 7px -10px rgb(0 0 0 / 30%) inset !important
</style>
