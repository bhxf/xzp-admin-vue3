<template>
    <q-toggle :label="newLabel" v-model="val" v-bind="$attrs"/>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface Props {
    modelValue:any,
    label:string,
    hideLabel:boolean,
}

const props = withDefaults(defineProps<Props>(), {
    modelValue:null,
    hideLabel:false,
})
const emit = defineEmits(['update:modelValue'])
const newLabel = ref(props.hideLabel?'':props.label)
const val = ref<any>(props.modelValue)

watch(props,()=>{
    val.value = props.modelValue
})

watch(val,(value)=>{
    emit('update:modelValue', value)
})

</script>
<script lang="ts">
export default {
    name: "XToggle",
};
</script>

<style scoped lang="less">
</style>
