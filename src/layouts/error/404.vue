<template>
  <div
    :style="getHeight"
    class="flex justify-center items-center rounded-borders"
  >
    <div class="flex column items-center q-pa-xl q-gutter-y-md">
      <q-icon
        size="lg"
        color="red"
        name="r_help_outline"
      />
      <div class="text-weight-bold text-h6">
        未找到
        <span class="text-red">({{ navTabStore.currentNavTab?.meta?.title }})</span>
        页面
      </div>
      <q-btn
        color="red"
        class="full-width"
        label="关闭"
        @click="closeCurrent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutStore } from '@/store/settings/layout';
import { useNavTabStore } from '@/store/settings/navigation';

const navTabStore = useNavTabStore();
const getHeight = computed(() => ({ height: useLayoutStore().getPageHeight }));
const closeCurrent = () => {
  navTabStore.removeCurrentNavTabById(navTabStore.currentNavTab.ID);
};
</script>
<script lang="ts">
export default {
  name: '404',
};
</script>

<style scoped lang="less">
</style>
