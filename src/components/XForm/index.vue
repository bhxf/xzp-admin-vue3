<template>
    <q-form
        ref="formRef"
        v-bind="$attrs"
        class="row x-form"
    >
        <div
            v-for="field in getFields"
            v-show="field?.hidden !== true"
            :key="field.name"
            :class="[`col-${field.col||12}`,'q-pa-xs flex column']"
        >
            <slot
                :name="field.name"
                v-bind="{field,formInfo}"
            >
                <x-field
                    v-bind="{
                        ...field,
                        getObj,
                        updateObj,
                        updateObjConfig,
                    }"
                    v-model="formInfo[field.name]"
                />
            </slot>
        </div>
    </q-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QForm } from 'quasar';
import { Field, getComponentsByName, XField } from '@/components';

interface Props {
    fields: Field[]
}

const props = withDefaults(defineProps<Props>(), {
    fields: () => [],
});
const formInfo = ref<any>({});
const formRef = ref<QForm | null>(null);

const newFields = ref<Field[]>(props.fields);

const getObj = () => formInfo.value;
const clear = () => {
    formInfo.value = {};
};
const updateObj = (data:any) => {
    formInfo.value = Object.assign(formInfo.value, data);
};
const updateObjConfig = (obj:any) => {
    newFields.value.forEach((item) => {
        Object.keys(obj).forEach((key) => {
            if (item.name === key) {
                // eslint-disable-next-line no-param-reassign
                item = Object.assign(item, obj[key]);
            }
        });
    });
};

const getFields = computed(() => {
    const defaultComponentsProps = {
        dense: true,
        outlined: false,
        standout: '',
        stackLabel: true,
        hint: '',
        clearable: true,
    };
    const result = newFields.value.map((item) => {
        const isLabels = ['toggle', 'checkbox', 'radio'];
        if (item.components && isLabels.includes(item.components.toString())) {
            if (item.isLabel !== true) item.isLabel = true;
        }
        if (typeof item.components === 'string') item.components = getComponentsByName(item.components || 'input');

        if (item.required === true) {
            if (!item.componentsProps) item.componentsProps = {};
            item.componentsProps.lazyRules = true;
        }
        item.componentsProps = { ...defaultComponentsProps, ...item.componentsProps };

        return item;
    });
    return result;
});
const getFormRef = computed(() => formRef.value);

const init = () => {
    // 设置默认值
    newFields.value.forEach((item:any) => {
        if (typeof item.defaultValue === 'undefined') {
            formInfo.value[item.name] = null;
        } else {
            formInfo.value[item.name] = item.defaultValue;
        }
    });
};

init();

defineExpose({
    formInfo, updateObj, getFormRef, clear,
});

</script>
<script lang="ts">
export default {
    name: 'XForm',
};
</script>

<style scoped lang="sass">
.x-form
    ::v-deep(.q-field__bottom)
        display: none
    ::v-deep(.q-field--with-bottom)
        padding-bottom: 0
</style>
