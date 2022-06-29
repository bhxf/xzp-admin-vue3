<template>
    <div class="row items-center justify-start q-gutter-x-sm">
        <q-btn
            v-for="(btn,index) in newBtnList"
            v-bind="btn"
            :key="index"
            :disable="isDisable(btn?.isDisable)"
            :loading="isLoading(btn?.isLoading)"
        >
            <q-tooltip v-if="btn.tooltip">{{ btn.tooltip }}</q-tooltip>
        </q-btn>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { BtnGroup } from '@/components';
import { clone } from 'lodash-es';

interface Props {
    btnList: BtnGroup[]
}

const props = withDefaults(defineProps<Props>(), {
    btnList: () => [],
});
const newBtnList = ref<BtnGroup[]>(clone(props.btnList));

const isDisable = (disable: any) => {
    if (disable && typeof disable === 'function') return disable();
    return false;
};
const isLoading = (loading: any) => {
    if (loading && typeof loading === 'function') return loading();
    return false;
};
const init = () => {
    newBtnList.value = newBtnList.value.map((item) => {
        const defaultConfig = {
            flat: true,
            dense: true,
            color: 'primary',
        };
        return Object.assign(defaultConfig, item);
    });
};

init();

</script>
<script lang="ts">
export default {
    name: 'XBtnGroup',
};
</script>

<style scoped lang="sass">
</style>
