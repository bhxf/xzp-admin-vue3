<template>
    <div class="row q-pl-sm q-pr-sm">
        <div class="col-8 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="delayOptionRef"
                        style="height: 250px"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-4 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="roundedOptionRef"
                        style="height: 250px"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-4 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="waterfallOptionRef"
                        style="height: 250px"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-4 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="candlestickOptionsRef"
                        style="height: 250px"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-4 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="roundCapOptionsRef"
                        style="height: 250px"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-8 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="radarOptionsRef"
                        style="height: 450px"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-4 q-pa-sm">
            <q-card flat>
                <q-card-section>
                    <div
                        ref="scatterOptionsRef"
                        style="height: 450px"
                    />
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEcharts } from '@/hooks/echarts';
import { nextTick, ref } from 'vue';
import delayOption from '@/views/dashboard/delay';
import roundedOption from '@/views/dashboard/rounded';
import waterfallOption from '@/views/dashboard/waterfall';
import candlestickOptions from '@/views/dashboard/candlestick';
import radarOptions from '@/views/dashboard/radar';
import scatterOptions from '@/views/dashboard/scatter';
import roundCapOptions from '@/views/dashboard/roundCap';

const delayOptionRef = ref<HTMLElement|null>(null);
const roundedOptionRef = ref<HTMLElement|null>(null);
const waterfallOptionRef = ref<HTMLElement|null>(null);
const candlestickOptionsRef = ref<HTMLElement|null>(null);
const radarOptionsRef = ref<HTMLElement|null>(null);
const scatterOptionsRef = ref<HTMLElement|null>(null);
const roundCapOptionsRef = ref<HTMLElement|null>(null);
const initEcharts = async () => {
    await nextTick();
    useEcharts(delayOptionRef, delayOption);
    useEcharts(roundedOptionRef, roundedOption);
    useEcharts(waterfallOptionRef, waterfallOption);
    useEcharts(candlestickOptionsRef, candlestickOptions);
    useEcharts(radarOptionsRef, radarOptions);
    useEcharts(scatterOptionsRef, scatterOptions);
    useEcharts(roundCapOptionsRef, roundCapOptions);
};
initEcharts();
</script>
<script lang="ts">
export default {
    name: 'Dashboard',
};
</script>

<style scoped lang="sass">
</style>
