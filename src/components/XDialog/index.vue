<template>
    <q-dialog v-model="showDialog">
        <q-card class="x-dialog">
            <q-card-section class="row q-pa-sm items-center bg-primary text-white">
                <slot name="title"/>
                <q-space/>
                <q-btn icon="close" flat round dense v-close-popup/>
            </q-card-section>

            <q-card-section>
                <slot/>
            </q-card-section>

            <q-card-actions align="right" class="actions">
                <slot name="actions"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface Props {
    modelValue:boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false
})
const emit = defineEmits(['update:modelValue'])

const showDialog = ref<boolean>(props.modelValue)

watch(props,()=>{
    showDialog.value = props.modelValue
})

watch(showDialog,(value)=>{
    emit('update:modelValue', value)
})


</script>
<script lang="ts">
export default {
    name: "XDialog",
};
</script>

<style scoped lang="sass">
.body--light
    .x-dialog
        .actions
            background: $grey-2
.body--dark
    .x-dialog
        .actions
            background: $grey-9
</style>
