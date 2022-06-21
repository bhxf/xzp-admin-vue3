<template>
    <router-view />
</template>

<script setup lang="ts">
import { NavTab, useNavTabStore } from '@/store/settings/navigation';
import { computed, watch } from 'vue';
import { SettingsEnum } from '@/tools/http';

const navTabStore = useNavTabStore();
const currentNavTabs = computed(() => navTabStore.currentNavTabs);

watch(currentNavTabs, (value: NavTab[]) => {
    sessionStorage.setItem(SettingsEnum.TABS, JSON.stringify(value));
}, { deep: true });
</script>
