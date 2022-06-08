<template>
    <div class="flex row no-wrap q-gutter-x-sm">
        <div v-for="(item,index) in list">
            <q-list bordered padding dense class="rounded-borders">
                <q-item
                    v-for="sub in item"
                    clickable
                    v-ripple
                    @click="addChildren(sub,index)"
                    active-class="menu-active"
                    :active="activeList[index] === sub[itemKey]"
                >
                    <slot name="item" v-bind="sub">
                        <q-item-section>
                            <q-item-label lines="1">
                                {{sub[itemName]}}
                            </q-item-label>
                        </q-item-section>
                    </slot>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

interface Props {
    dataSource:any[],
    itemKey?:string,
    itemName?:string,
    itemChildren?:string,
    itemParent?:string,
}

const props = withDefaults(defineProps<Props>(), {
    dataSource:()=>[],
    itemKey:'ID',
    itemName:'name',
    itemChildren:'children',
    itemParent:'parentId',
})

const list = ref<any[]>([])
const activeList = ref<any[]>([])

list.value.push(props.dataSource)

const addChildren = (data:any,index:number) => {
    const children = data?.[props.itemChildren]||[]
    const delIndex = list.value.length-(index+1)
    const startIndex = index+1
    if (children.length>0){
        list.value.splice(startIndex,delIndex,children)
    }else {
        list.value.splice(startIndex,delIndex)
    }
    activeList.value.splice(startIndex-1,delIndex-1,data[props.itemKey])
}

</script>
<script lang="ts">
export default {
    name: "XCascadeList",
};
</script>

<style scoped lang="sass">
.body--dark
    .menu-active
        background-color: rgb($primary,0.1)
        color: $primary
        font-weight: bold

.body--light
    .menu-active
        background-color: rgb($primary,0.1)
        color: $primary
        font-weight: bold
</style>
