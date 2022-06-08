<template>
    <component
        v-model="val"
        v-bind="{...componentsProps,...errorObj}"

        :label="label"
        :is="components"
        :required="required"
    >
        <template v-if="required === true" v-slot:append>
            <q-icon size="xs" name="r_star_border" color="red"/>
        </template>
    </component>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface FieldProps {
    label: string,
    components: any,
    componentsProps?: any,
    errorObj?: any,
    modelValue: any,
    required?: boolean,

    getObj?: () => any
    updateObj?: (info: any) => void
    updateObjConfig?: (fields: any) => void,
    changeCallback:(obj:any)=>void
}

const props = withDefaults(defineProps<FieldProps>(), {
    modelValue: null,
    required: false,

    getObj: () => {},
    updateObj: (info: any) => null,
    updateObjConfig: (fields: any) => null,
    changeCallback: (obj: any) => null,
})

const val = ref<any>(props.modelValue)
const emit = defineEmits(['update:model-value'])

watch(props, (value) => {
    value !== val.value && (val.value = props.modelValue)
}, {deep: true})

watch(val, (value) => {
    emit('update:model-value', value)
    props.changeCallback({
        getObj:props.getObj,
        updateObj:props.updateObj,
        updateObjConfig:props.updateObjConfig,
    })
})


</script>
<script lang="ts">
export default {
    name: "XField",
};
</script>

<style scoped lang="sass">
</style>
