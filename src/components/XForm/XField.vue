<template>
    <div class="column x-field">
        <!--        <div-->
        <!--            v-if="label && isLabel !== true"-->
        <!--            class="row items-center justify-start q-pl-xs q-gutter-x-xs"-->
        <!--        >-->
        <!--            <div class="field-label text-subtitle2">-->
        <!--                {{ label }}-->
        <!--            </div>-->
        <!--            <q-icon-->
        <!--                size="12px"-->
        <!--                v-if="required===true"-->
        <!--                color="red"-->
        <!--                name="r_star"-->
        <!--            />-->
        <!--        </div>-->

        <!--        <component-->
        <!--            v-bind="{...componentsProps,...errorObj}"-->
        <!--            :is="components"-->

        <!--            v-model="val"-->
        <!--            :required="required"-->
        <!--            :label="isLabel?label:undefined"-->
        <!--        />-->
        <component
            v-bind="{...componentsProps,...errorObj}"
            v-model="val"

            :is="components"
            :required="required"
            :label="label"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChangeCallback } from '@/components';

interface FieldProps {
    label: string,
    isLabel?: boolean,
    components: any,
    componentsProps?: any,
    errorObj?: any,
    modelValue: any,
    required?: boolean,

    getObj?: () => any
    updateObj?: (info: any) => void
    updateObjConfig?: (fields: any) => void,
    changeCallback?: ChangeCallback
}

const props = withDefaults(defineProps<FieldProps>(), {
    label: undefined,
    isLabel: false,
    modelValue: null,
    required: false,
    componentsProps: undefined,
    errorObj: undefined,
    getObj: () => {},
    updateObj: (info: any) => null,
    updateObjConfig: (fields: any) => null,
    changeCallback: (obj: any) => null,
});

const val = ref<any>(props.modelValue);
const emit = defineEmits(['update:model-value']);

watch(props, () => {
    if (props.modelValue !== val.value) val.value = props.modelValue;
}, { deep: true });

watch(val, (value) => {
    emit('update:model-value', value);
    if (typeof props.changeCallback === 'function') {
        props.changeCallback(
            props.getObj,
            props.updateObj,
            props.updateObjConfig,
        );
    }
});

</script>
<script lang="ts">
export default {
    name: 'XField',
};
</script>

<style scoped lang="sass">
.x-field
    ::v-deep(.q-field__bottom)
        padding: 0
    ::v-deep(.q-field--with-bottom)
        padding-bottom: 4px
.body--light
    .field-label
        color: $grey-9

.body--dark
    .field-label
        color: white
</style>
