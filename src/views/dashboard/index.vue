<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-xs">
        Our Changing Planet
      </div>
    </q-card-section>
    <q-card-section>
      <x-form :fields="fields" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { Field, XForm } from '@/components';

const fields = ref<Field[]>(
  [],
);

</script>
<script lang="ts">
export default {
  name: 'Dashboard',
};
</script>

<style scoped lang="less">
</style>
