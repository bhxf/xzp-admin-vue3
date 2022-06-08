<template>
  <q-drawer
    v-model="drawer"
    :width="200"
    :breakpoint="500"
  >
    <q-scroll-area class="fit">
      <q-list padding class="menu-list">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>

          <q-item-section>
            Inbox
          </q-item-section>
        </q-item>

      </q-list>

    </q-scroll-area>
  </q-drawer>

</template>

<script setup lang="ts">
import {ref} from "vue";

const drawer = ref(false)
</script>
<script lang="ts">
export default {
  name: "LayoutNavigation",
};
</script>
<style scoped lang="sass">
</style>
