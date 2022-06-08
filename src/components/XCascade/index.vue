<template>
    <q-menu v-bind="$attrs" fit>
        <q-list padding>
            <q-item
                v-for="item in dataSource"
                :key="item[itemKey]"
                dense
                clickable
            >
                <slot name="item" v-bind="item">
                    <q-item-section>{{item[itemName]}}</q-item-section>
                </slot>
                <q-item-section v-if="item[itemChildren]&&item[itemChildren].length>0" side>
                    <q-icon name="keyboard_arrow_right" />
                </q-item-section>
                <x-cascade
                    anchor="top right" self="top left"
                    v-if="item[itemChildren]&&item[itemChildren].length>0"
                    :data-source="item[itemChildren]"
                >
                    <template #item="item">
                        <slot name="item" v-bind="item"/>
                    </template>
                </x-cascade>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script setup lang="ts">
interface Props {
    dataSource:any[],
    itemKey?:string,
    itemName?:string,
    itemChildren?:string,
    itemParent?:string,
}

const props = withDefaults(defineProps<Props>(), {
    dataSource:()=>[],
    itemKey:'ID',
    itemName:'name',
    itemChildren:'children',
    itemParent:'parentId',
})
</script>
<script lang="ts">
export default {
    name: "XCascade",
};
</script>

<style scoped lang="less">
</style>
