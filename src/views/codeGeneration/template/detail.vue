<template>
    <div
        :style="getHeight"
        class="flex column"
    >
        <div class="col-auto row q-pa-sm q-pl-md items-center">
            <div class="row q-gutter-x-xs items-center ">
                <q-icon
                    size="md"
                    name="r_title"
                    color="positive"
                />
                <span class="text-weight-medium text-h6 text-grey-9">{{ codeTemplate.name }}</span>
            </div>
            <q-space />
            <q-btn
                :disable="!primaryKey"
                :loading="loadings['saveBase']"
                round
                flat
                dense
                icon="r_save"
                color="primary"
                @click="onSaveBase"
            >
                <q-tooltip>保存</q-tooltip>
            </q-btn>
            <q-btn
                :disable="!primaryKey"
                round
                flat
                dense
                icon="r_refresh"
                color="primary"
                @click="loadBase"
            >
                <q-tooltip>刷新</q-tooltip>
            </q-btn>
        </div>
        <div class="col">
            <XMonaco
                ref="xMonacoRef"
                v-model="codeTemplate.context"
                :model-type="getModel"
            />
            <q-inner-loading :showing="loadings['base']">
                <q-spinner-gears
                    size="50px"
                    color="primary"
                />
            </q-inner-loading>
        </div>
    </div>
</template>

<script setup lang="ts">
import { actionLoading } from '@/tools/action/curd';
import { computed, ref } from 'vue';
import { notify } from '@/hooks/message';
import useLayoutStore from '@/store/settings/layout';
import { getCodeTemplate, updateCodeTemplateContext } from '@/api/codeGeneration/template';
import XMonaco from '@/components/XMonaco/index.vue';

interface Props {
}

withDefaults(defineProps<Props>(), {});

const xMonacoRef = ref<{setModel:(val:string, type:string)=>void}|null>(null);
const primaryKey = ref();
const codeTemplate = ref({
    context: '',
    name: '',
});

const { loadings } = actionLoading('base', 'saveBase');

const onSaveBase = async () => {
    try {
        loadings.value.saveBase = true;
        await updateCodeTemplateContext(codeTemplate.value);
        notify.success('保存成功');
    } finally {
        loadings.value.saveBase = false;
    }
};

const loadBase = async () => {
    loadings.value.base = true;
    codeTemplate.value = await getCodeTemplate({ id: primaryKey.value });
    xMonacoRef.value?.setModel(codeTemplate.value.context, getModel.value);
    loadings.value.base = false;
};
const loadData = (id: any) => {
    primaryKey.value = id;
    if (!id) {
        codeTemplate.value = {
            context: '',
            name: '',
        };
    }
    loadBase();
};
const getModel = computed(() => {
    const modelTypeList = codeTemplate.value.name.split('.');
    const modelType = modelTypeList[modelTypeList.length - 1];
    return modelType || 'json';
});

const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));

defineExpose({ loadData });

</script>
<script lang="ts">
export default {
    name: 'TemplateDetail',
};
</script>

<style scoped lang="less">
</style>
