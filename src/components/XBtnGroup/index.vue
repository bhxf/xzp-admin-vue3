<template>
    <div>
        <q-btn
            flat
            dense
            round
            color="primary"
            v-for="(btn,index) in newBtnList"
            v-bind="btn"
            :key="index"
            :disable="isDisable(btn?.isDisable)"
        >
            <q-tooltip>{{ btn.tooltip }}</q-tooltip>
        </q-btn>
    </div>
</template>

<script setup lang="ts">

import {Btn} from "@/components/XBtnGroup";
import {ref} from "vue";

interface Props {
    btnList: Btn[]
}

const props = withDefaults(defineProps<Props>(), {
    btnList: () => []
})

const newBtnList = ref<Btn[]>(props.btnList)
const isDisable = (disable: any) => {
    if (disable && typeof disable === 'function') return disable()
    return false
}

</script>
<script lang="ts">
export default {
    name: "XBtnGroup",
};
</script>

<style scoped lang="less">
</style>
