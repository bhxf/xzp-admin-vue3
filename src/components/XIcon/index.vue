<template>
    <q-input
        v-model="icon"
        v-bind="$attrs"
    >
        <template #prepend>
            <q-icon :name="icon" />
        </template>
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
        <q-popup-proxy class="shadow-10">
            <div
                class="x-icon column q-pa-md q-gutter-y-md"
                style="width: 550px;height: 400px;"
            >
                <div class="col-auto">
                    <q-input
                        v-model="search"
                        standout
                        rounded
                        dense
                    >
                        <template #append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
                <div class="flex col-auto items-center">
                    <div>
                        <q-option-group
                            v-model="iconType"
                            dense
                            inline

                            toggle-color="primary"
                            text-color="primary"
                            :options="[
                                {label: 'Outlined', value: 'Material Icons Outlined'},
                                {label: 'Filled', value: 'Material Icons'},
                                {label: 'Round', value: 'Material Icons Round'},
                                {label: 'Sharp', value: 'Material Icons Sharp'},
                            ]"
                        />
                    </div>
                    <q-space />
                    <q-chip
                        outline
                        color="primary"
                        dense
                    >
                        {{ getIconData.length }}
                    </q-chip>
                </div>
                <x-scroll-area>
                    <div class="row justify-between q-gutter-md q-pa-md">
                        <div
                            v-for="(item,index) in getIconData"
                            :key="index"
                            class="x-icon-item q-pa-md rounded-borders col-2 column justify-center items-center"
                            @click="onSelectIcon(item.name)"
                        >
                            <q-icon
                                size="md"
                                :name="getIconName(item.name)"
                            />
                        </div>
                    </div>
                </x-scroll-area>
            </div>
        </q-popup-proxy>
    </q-input>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import XScrollArea from '@/components/XScrollArea/index.vue';
import { icons } from '@/components/XIcon/data';

interface IconProps {
    defaultValue: string,
    modelValue: string,
    required?:boolean,
}

const props = withDefaults(defineProps<IconProps>(), {
    defaultValue: 'insert_emoticon',
    required: false,
});

const emit = defineEmits(['update:modelValue']);
const icon = ref<string>(props.modelValue);
const search = ref<string>('');
const iconType = ref<string>('Material Icons');
const iconName: any = {
    'Material Icons Outlined': 'o_',
    'Material Icons': '',
    'Material Icons Round': 'r_',
    'Material Icons Sharp': 's_',
};

const onSelectIcon = (name: string) => {
    icon.value = iconName[iconType.value] + name;
};
const getIconName = computed(() => (name: string) => iconName[iconType.value] + name);
const getIconData = computed(() => {
    const list = icons.filter((item: any) => {
        if (search.value) {
            if (
                !item.unsupported_families.includes(iconType.value)
                && item.name.indexOf(search.value) !== -1) {
                return item;
            }
        } else if (!item.unsupported_families.includes(iconType.value)) {
            return item;
        }

        return null;
    });
    return list || [];
});

watch(props, () => {
    if (props.modelValue !== icon.value) icon.value = props.modelValue;
}, { deep: true });

watch(icon, () => {
    emit('update:modelValue', icon.value);
}, { immediate: true });

</script>

<script lang="ts">
export default {
    name: 'XIcon',
};
</script>

<style scoped lang="sass">
.my-custom-toggle
    border: 1px solid #027be3

.body--light
    .x-icon
        background: white

        .x-icon-item:hover
            background: rgb($primary,0.1)
            cursor: pointer

        .x-icon-item
            background: $grey-1

.body--dark
    .x-icon
        background: $dark

        .x-icon-item:hover
            background: rgb($primary,0.1)
            cursor: pointer

        .x-icon-item
            background: $grey-9
</style>
