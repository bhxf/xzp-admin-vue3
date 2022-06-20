<template>
    <div>
        <q-btn
            v-for="(btn,index) in newBtnList"
            v-bind="btn"
            :key="index"
            flat
            dense
            round
            color="primary"
            :disable="isDisable(btn?.isDisable)"
        >
            <q-tooltip>{{ btn.tooltip }}</q-tooltip>
        </q-btn>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { BtnGroup } from '@/components';

interface Props {
    btnList: BtnGroup[]
}

const props = withDefaults(defineProps<Props>(), {
    btnList: () => [],
});

const newBtnList = ref<BtnGroup[]>(props.btnList);
const isDisable = (disable: any) => {
    if (disable && typeof disable === 'function') return disable();
    return false;
};

</script>
<script lang="ts">
export default {
    name: 'XBtnGroup',
};
</script>

<style scoped lang="less">
</style>
