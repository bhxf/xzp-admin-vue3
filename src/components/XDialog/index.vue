<template>
    <q-dialog v-model="showDialog">
        <q-card class="x-dialog">
            <q-card-section class="row title q-pa-md items-center">
                <slot
                    name="title"
                    v-bind="{title}"
                >
                    <div class="text-h6">
                        {{ title }}
                    </div>
                </slot>
                <q-space />
                <q-btn
                    v-close-popup
                    icon="close"
                    flat
                    round
                    dense
                />
            </q-card-section>

            <q-card-section class="q-pa-md">
                <slot />
            </q-card-section>

            <q-card-actions
                align="right"
                class="actions"
            >
                <slot name="actions" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
    modelValue:boolean
    title:string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
});
const emit = defineEmits(['update:modelValue']);

const showDialog = ref<boolean>(props.modelValue);

watch(props, () => {
    showDialog.value = props.modelValue;
});

watch(showDialog, (value) => {
    emit('update:modelValue', value);
});

</script>
<script lang="ts">
export default {
    name: 'XDialog',
};
</script>

<style scoped lang="sass">
.body--light
    .x-dialog
        .title
            background: $grey-2
        .actions
            background: $grey-2
.body--dark
    .x-dialog
        .title
            background: $grey-10
        .actions
            background: $grey-10
</style>
