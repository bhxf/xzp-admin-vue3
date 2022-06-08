<template>
    <div class="row full-width justify-center q-pt-md col">
        <div class="col-8 row no-wrap q-gutter-x-sm">
            <x-scroll-area ref="scrollAreaRef" class="q-pr-md" @scroll="onScroll">
                <q-card class="q-mb-md" :id="formArea.name" flat bordered v-for="formArea in formAreas"
                        :key="formArea.name">
                    <q-card-section class="q-pa-none">
                        <div class="row items-center no-wrap q-pt-sm q-pl-md q-pr-md">
                            <div class="col text-h6">{{ formArea.label }}</div>
                            <div class="col-auto">
                                <slot :name="`${formArea.name}Action`"/>
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <slot :name="formArea.name"/>
                    </q-card-section>
                </q-card>
            </x-scroll-area>
            <div class="col-auto">
                <q-list dense bordered padding class="rounded-borders">
                    <q-item
                        v-for="formArea in formAreas"
                        clickable
                        v-ripple
                        :tag="formArea.name"
                        :active="active === formArea.name"
                        @click="onClick(formArea.name)"
                    >
                        <q-item-section side>
                            <q-radio dense v-model="active" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                                     :val="formArea.name"/>
                        </q-item-section>

                        <q-item-section>{{ formArea.label }}</q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>

        <slot name="loading"></slot>
    </div>
</template>

<script setup lang="ts">
import {XFormArea} from "@/components/XFormArea/index";
import {ref} from "vue";
import XScrollArea from "@/components/XScrollArea/index.vue";
import {QScrollArea} from "quasar";

interface Props {
    hideFormArea?: boolean,
    formAreas: XFormArea[],
    height: number,
}

const props = withDefaults(defineProps<Props>(), {
    formAreas: () => [],
    hideArea: false,
})

const active = ref('')
const updateScroll = ref(true)
const scrollAreaRef = ref<{ scrollAreaRef: QScrollArea } | null>(null)

const animateScroll = (offsetTop: number) => {
    scrollAreaRef.value?.scrollAreaRef.setScrollPosition('vertical', offsetTop, 300)
}
const onClick = (name: string) => {
    updateScroll.value = false
    active.value = name
    const offsetTop = document.getElementById(name)?.offsetTop
    animateScroll(offsetTop || 0)
    setTimeout(()=>updateScroll.value = true,500)

}
const onScroll = ({verticalPosition}: any) => {
    if (!updateScroll.value) return
    for (let i = 0; i < props.formAreas.length; i++) {
        const name = props.formAreas[i].name
        const offsetTop = document.getElementById(name)?.offsetTop || 0
        const difference = offsetTop - verticalPosition
        if (difference >= 0 && difference <= 20) {
            active.value = name
            break
        }
    }
}

const init = () => {
    active.value = props.formAreas[0].name
}
init()

defineExpose({})
</script>
<script lang="ts">
export default {
    name: "XFormArea",
};
</script>

<style scoped lang="less">
</style>
