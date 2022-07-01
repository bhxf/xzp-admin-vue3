<template>
    <div class="row justify-center items-start q-pa-lg">
        <q-list
            v-if="list.length>0"
            padding
            bordered
            class="rounded-borders"
            style="width: 500px;"
            separator
        >
            <q-item>
                <q-item-section>
                    <div class="row no-wrap q-gutter-x-md items-center">
                        <q-input
                            v-model="pkgName"
                            class="col"
                            dense
                            standout
                            placeholder="包名"
                        />
                        <q-input
                            v-model="prefix"
                            class="col"
                            dense
                            standout
                            placeholder="表替换前缀"
                        />
                    </div>
                </q-item-section>
            </q-item>
            <q-item
                v-for="item in list"
                :key="item.name"
                v-ripple
                clickable
                :active="item?.isPrimary === true"
                active-class="bg-primary text-white rounded-borders"
            >
                <q-item-section>
                    <div class="row no-wrap q-gutter-x-md items-center">
                        <div class="text-subtitle1 text-weight-medium col-auto">
                            {{ item?.label }}
                        </div>
                        <q-select
                            v-model="selectedTable[item.name]"
                            class="col"

                            :options="fieldConfigList"
                            :multiple="list.length === 1"

                            standout
                            map-options
                            emit-value
                            clearable
                            use-chips
                        />
                    </div>
                </q-item-section>
            </q-item>
            <q-item>
                <q-btn
                    :loading="loadings.genCode"
                    size="md"
                    color="primary"
                    icon="r_download"
                    label="生成代码"
                    @click="onGenCode"
                />
            </q-item>
        </q-list>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { genCode, getFieldConfigList } from '@/api/codeGeneration/field';
import { notify } from '@/hooks/message';
import { actionLoading } from '@/tools/action/curd';

const list = ref<any>([]);
const pkgName = ref('');
const prefix = ref('');
const fieldConfigList = ref([]);
const selectedTable = ref<any>({});
const templateId = ref('');
const { loadings } = actionLoading('genCode');

const loadData = (node:any) => {
    templateId.value = node.ID;
    list.value = [];
    selectedTable.value = {};
    try {
        list.value = JSON.parse(node.context || '[]');
    } catch (e) {
        notify.error('不支持的格式');
    }
};
const loadFieldConfig = async () => {
    const { list } = await getFieldConfigList();
    fieldConfigList.value = list.map((item:any) => ({ label: item.tablesName, value: item.ID }));
};
const onGenCode = async () => {
    const data = {
        pkgName: pkgName.value,
        prefix: prefix.value,
        templateId: templateId.value,
        tables: selectedTable.value,
    };

    try {
        loadings.value.genCode = true;
        const downloadHref = await genCode(data);
        window.open(downloadHref, '_blank');
    } finally {
        loadings.value.genCode = false;
    }
};

loadFieldConfig();

defineExpose({ loadData });
</script>
<script lang="ts">
export default {
    name: 'GenCodeDetail',
};
</script>

<style scoped lang="less">
</style>
