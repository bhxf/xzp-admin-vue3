<template>
    <div class="row full-width justify-center q-pt-md col">
        <div class="col-8 row no-wrap q-gutter-x-sm">
            <x-scroll-area
                ref="scrollAreaRef"
                class="q-pr-md"
                @scroll="onScroll"
            >
                <q-card
                    v-for="formArea in formAreas"
                    :id="formArea.name"
                    :key="formArea.name"
                    class="q-mb-md"
                    flat
                    bordered
                >
                    <q-card-section class="q-pa-none">
                        <div class="row items-center no-wrap q-pt-sm q-pl-md q-pr-md">
                            <div class="col text-h6">
                                {{ formArea.label }}
                            </div>
                            <div class="col-auto">
                                <slot :name="`${formArea.name}Action`" />
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <slot :name="formArea.name" />
                    </q-card-section>
                </q-card>
            </x-scroll-area>
            <div class="col-auto">
                <q-list
                    dense
                    bordered
                    padding
                    class="rounded-borders"
                >
                    <q-item
                        v-for="formArea in formAreas"
                        :key="formArea.name"
                        v-ripple
                        clickable
                        :tag="formArea.name"
                        :active="active === formArea.name"
                        @click="onClick(formArea.name)"
                    >
                        <q-item-section side>
                            <q-radio
                                v-model="active"
                                dense
                                checked-icon="task_alt"
                                unchecked-icon="panorama_fish_eye"
                                :val="formArea.name"
                            />
                        </q-item-section>

                        <q-item-section>{{ formArea.label }}</q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>

        <slot name="loading" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import XScrollArea from '@/components/XScrollArea/index.vue';
import { QScrollArea } from 'quasar';
import { FormArea } from '@/components';

interface Props {
    hideFormArea?: boolean,
    formAreas: FormArea[],
}

const props = withDefaults(defineProps<Props>(), {
    formAreas: () => [],
    hideArea: false,
});

const active = ref('');
const updateScroll = ref(true);
const scrollAreaRef = ref<{ scrollAreaRef: QScrollArea } | null>(null);

const animateScroll = (offsetTop: number) => {
    scrollAreaRef.value?.scrollAreaRef.setScrollPosition('vertical', offsetTop, 300);
};
const onClick = (name: string) => {
    updateScroll.value = false;
    active.value = name;
    const offsetTop = document.getElementById(name)?.offsetTop;
    animateScroll(offsetTop || 0);
    setTimeout(() => {
        updateScroll.value = true;
    }, 500);
};
const onScroll = ({ verticalPosition }: any) => {
    console.log(verticalPosition);
    for (let i = 0; i < props.formAreas.length; i += 1) {
        const { name } = props.formAreas[i];
        const offsetTop = document.getElementById(name)?.offsetTop || 0;
        const difference = offsetTop - verticalPosition;
        if (difference >= 0 && difference <= 20) {
            active.value = name;
            break;
        }
    }
};

const init = () => {
    active.value = props.formAreas[0].name;
};
init();

defineExpose({});
</script>
<script lang="ts">
export default {
    name: 'XFormArea',
};
</script>

<style scoped lang="sass">
</style>
