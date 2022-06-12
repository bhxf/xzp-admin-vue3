<template>
    <router-view/>
</template>

<script setup lang="ts">
import { NavTab, useNavTabStore } from '@/store/settings/navigation';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { settingsEnum } from '@/tools/http';

const router = useRouter();
const navTabStore = useNavTabStore();
const currentNavTab = computed(() => navTabStore.currentNavTab);
const currentNavTabs = computed(() => navTabStore.currentNavTabs);

watch(currentNavTab, (value: NavTab) => {
  sessionStorage.setItem(settingsEnum.TAB, JSON.stringify(value));
  navTabStore.updateCurrentNavTabs();
  router.push({ path: value.path || '/404' });
}, { deep: true });
watch(currentNavTabs, (value: NavTab[]) => {
  console.log(value);
  sessionStorage.setItem(settingsEnum.TABS, JSON.stringify(value));
}, { deep: true });
</script>
