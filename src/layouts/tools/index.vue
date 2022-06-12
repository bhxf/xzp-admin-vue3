<template>
  <q-page-sticky
    style="height: 100vh"
    expand
    position="top-right"
    :offset="[0,toolsPadding]"
  >
    <div class="layout-tools column full-height justify-start items-center q-gutter-y-md shadow-5">
      <q-btn
        color="blue"
        flat
        round
        icon="r_grid_view"
      />
      <q-btn
        color="grey-8"
        flat
        round
        icon="r_settings"
      />
      <q-btn
        color="light-blue"
        flat
        round
        icon="r_mail"
      >
        <q-badge
          color="red"
          rounded
          floating
          transparent
        >
          4
        </q-badge>
      </q-btn>
      <q-btn
        color="amber"
        flat
        round
        icon="r_color_lens"
      >
        <q-tooltip>主题</q-tooltip>
        <q-menu
          anchor="top left"
          self="top right"
        >
          <div class="column q-gutter-y-sm q-pa-md">
            <div
              v-for="color in colors"
              :key="color"
              @click="onActiveColor(color)"
            >
              <q-btn round>
                <q-avatar :style="{background:color}">
                  <q-icon
                    v-if="color===activeColor"
                    size="sm"
                    color="white"
                    name="r_verified"
                  />
                </q-avatar>
              </q-btn>
            </div>
          </div>
        </q-menu>
      </q-btn>
      <q-btn
        color="primary"
        flat
        round
        icon="r_restart_alt"
      />
      <q-btn
        color="primary"
        flat
        round
        icon="r_send"
      />
      <q-btn
        color="grey-8"
        flat
        round
        icon="r_history"
      />
    </div>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/store/settings/layout';
import { computed, ref } from 'vue';
import { setCssVar } from 'quasar';

const layoutStore = useLayoutStore();

const toolsPadding = computed(() => layoutStore.navHeight + 10);
const toolsWidth = computed(() => `${layoutStore.toolsWidth}px`);
const colors = ['#007bf5', '#ff8000', '#ff3333', '#8000ff', '#ff33ff'];
const activeColor = ref('#007bf5');
const onActiveColor = (color:string) => {
  activeColor.value = color;
  setCssVar('primary', color);
};

</script>
<script lang="ts">
export default {
  name: 'LayoutTools',
};
</script>

<style scoped lang="sass">
.layout-tools
    width: v-bind(toolsWidth)

.body--light
    .layout-tools
        background: white

.body--dark
    .layout-tools
        background: $grey-10
</style>
