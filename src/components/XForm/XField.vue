<template>
  <component
    v-bind="{...componentsProps,...errorObj}"
    :is="components"

    v-model="val"
    :label="label"
    :required="required"
  >
    <template
      v-if="required === true"
      #append
    >
      <q-icon
        size="xs"
        name="r_star_border"
        color="red"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChangeCallback } from '@/components';

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
    changeCallback?: ChangeCallback
}

const props = withDefaults(defineProps<FieldProps>(), {
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
  if (props.modelValue !== val.value)val.value = props.modelValue;
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
</style>
