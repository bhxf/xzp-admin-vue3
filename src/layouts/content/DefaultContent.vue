<template>
    <div
        class="content q-pa-xs rounded-borders q-ml-lg"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
</script>
<script lang="ts">
export default {
    name: 'DefaultContent',
};
</script>

<style scoped lang="sass">
.body--light
    .content
        background: white
.body--dark
    .content
        background: $dark
</style>
