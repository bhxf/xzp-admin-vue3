<template>
    <q-menu
        transition-show="jump-down"
        transition-hide="jump-up"
    >
        <div style="height: 350px" class="flex column">
            <div class="column q-pa-md col-auto">
                <q-input rounded v-model="keyword" standout dense placeholder="请输入关键字">
                    <template #append>
                        <q-icon name="search"/>
                    </template>
                    <template #after>
                        <q-btn v-if="!isAll" color="primary" flat dense round icon="radio_button_unchecked"
                               @click="onCheckAll"/>
                        <q-btn v-if="isAll" color="primary" flat dense round icon="task_alt" @click="onUnCheckAll"/>
                    </template>
                </q-input>
            </div>
            <x-scroll-area>
                <q-list dense>
                    <q-item v-for="item in getNewColumns" tag="label" v-ripple clickable>
                        <q-item-section side>
                            <q-checkbox dense v-model="item.show"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>
                                {{ item.label }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </x-scroll-area>
        </div>
    </q-menu>
</template>

<script setup lang="ts">

import XScrollArea from "@/components/XScrollArea/index.vue";
import {computed, inject, ref} from "vue";

const keyword = ref<string>('')
const newColumns = inject<any>('newColumns')
const getNewColumns = computed(() => {
    if (!keyword.value) return newColumns.value
    return newColumns.value.filter((item: any) => (item.label.indexOf(keyword.value) !== -1))
})
const onCheckAll = () => {
    newColumns.value.forEach((item: any) => item.show = true)
}
const onUnCheckAll = () => {
    newColumns.value.forEach((item: any) => item.show = false)
}
const isAll = computed(() => {
    const check = newColumns.value.filter((item: any) => item.show === true)
    if (!check || check.length === 0) return false
    return check.length = newColumns.value.length
})

</script>
<script lang="ts">
export default {
    name: "XFieldSetting",
};
</script>

<style scoped lang="less">
</style>
