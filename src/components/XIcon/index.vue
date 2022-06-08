<template>
    <q-input v-model="icon" v-bind="$attrs">
        <template #prepend>
            <q-icon :name="icon" />
        </template>
        <template v-if="required === true" #append>
            <q-icon size="xs" name="r_star_border" color="red"/>
        </template>
        <q-popup-proxy>
            <div class="x-icon column shadow-2 q-pa-md q-gutter-y-md" style="width: 550px;height: 400px;">
                <div class="col-auto">
                    <q-input standout rounded dense v-model="search">
                        <template #append>
                            <q-icon name="search"/>
                        </template>
                    </q-input>
                </div>
                <div class="flex col-auto">
                    <q-btn-toggle
                        v-model="iconType"
                        class="my-custom-toggle"
                        no-caps
                        rounded
                        unelevated
                        toggle-color="primary"
                        color="white"
                        text-color="primary"
                        :options="[
                          {label: 'Outlined', value: 'Material Icons Outlined'},
                          {label: 'Filled', value: 'Material Icons'},
                          {label: 'Round', value: 'Material Icons Round'},
                          {label: 'Sharp', value: 'Material Icons Sharp'},
                        ]"
                    />
                    <q-space/>
                    <q-chip>
                        {{ getIconData.length }}
                    </q-chip>
                </div>
                <x-scroll-area>
                    <div class="row justify-between q-gutter-md q-pa-md">
                        <div @click="onSelectIcon(item.name)"
                             class="x-icon-item q-pa-md rounded-borders col-2 column justify-center items-center"
                             v-for="(item,index) in getIconData" :key="index">
                            <q-icon size="md" :name="getIconName(item.name)"/>
                        </div>
                    </div>
                </x-scroll-area>
            </div>
        </q-popup-proxy>
    </q-input>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import XScrollArea from "@/components/XScrollArea/index.vue";
import {icons} from "@/components/XIcon/data";

interface IconProps {
    defaultValue: string,
    modelValue: string,
    required?:boolean,
}

const props = withDefaults(defineProps<IconProps>(), {
    defaultValue: 'insert_emoticon',
    required:false,
})

const emit = defineEmits(['update:modelValue'])
const icon = ref<string>(props.defaultValue)
const search = ref<string>('')
const iconType = ref<string>('Material Icons')
const iconName: any = {
    'Material Icons Outlined': 'o_',
    'Material Icons': '',
    'Material Icons Round': 'r_',
    'Material Icons Sharp': 's_',
}

const onSelectIcon = (name: string) => {
    icon.value = iconName[iconType.value] + name
}
const getIconName = computed(() => {
    return (name: string) => {
        return iconName[iconType.value] + name
    }
})
const getIconData = computed(() => {
    return icons.filter((item: any) => {
        if (search.value) {
            if (!item.unsupported_families.includes(iconType.value) && item.name.indexOf(search.value) !== -1) {
                return item;
            }
        } else {
            if (!item.unsupported_families.includes(iconType.value)) {
                return item;
            }
        }
    })
})

watch(icon, () => {
    emit('update:modelValue', icon.value)
},{immediate:true})

</script>

<script lang="ts">
export default {
    name: "",
};
</script>

<style scoped lang="sass">
.my-custom-toggle
    border: 1px solid #027be3

.body--light
    .x-icon
        background: white

        .x-icon-item:hover
            background: $primary
            color: white
            cursor: pointer

        .x-icon-item
            background: $grey-1

.body--dark
    .x-icon
        background: $dark

        .x-icon-item:hover
            background: $primary
            color: white
            cursor: pointer

        .x-icon-item
            background: $grey-8
</style>
