<template>
    <q-card>
        <q-card-section>
            <div class="text-h6 q-mb-xs">Our Changing Planet</div>
        </q-card-section>
        <q-card-section>
            <x-form :fields="fields">
            </x-form>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">

import {Field,XForm} from "@/components/XForm/index";
import {ref} from "vue";

const fields = ref<Field[]>(
    []
)

fields.value.push(
    {label: `test1`, name: `test1`,col:4, components: 'input',required:true,componentsProps:{hint:'wode'}},
    {label: `test2`, name: `test2`,col:4, components: 'select',required:true},
    {label: `test3`, name: `test3`,col:4, components: 'radio',required:true},
    {label: `test4`, name: `test4`,col:4, components: 'range',required:true},
    {label: `test5`, name: `test5`, components: 'checkbox',required:true},
    {label: `test1`, name: `test1`, components: 'input',required:true},
    {label: `test2`, name: `test2`,col:4, components: 'select',required:true},
    {label: `test3`, name: `test3`,col:4, components: 'radio',required:true},
    {label: `test4`, name: `test4`,col:4, components: 'range',required:true},
    {label: `test5`, name: `test5`,col:4, components: 'checkbox',required:true},
    {label: `test1`, name: `test1`,col:4, components: 'input',required:true},
    {label: `test2`, name: `test2`, components: 'select',required:true},
    {label: `test3`, name: `test3`, components: 'radio',required:true},
    {label: `test4`, name: `test4`, components: 'range',required:true},
    {label: `test5`, name: `test5`, components: 'checkbox',required:true},
)

</script>
<script lang="ts">
export default {
    name: "Add",
};
</script>

<style scoped lang="less">
</style>
