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

</script>
<script lang="ts">
export default {
    name: "Add",
};
</script>

<style scoped lang="less">
</style>
