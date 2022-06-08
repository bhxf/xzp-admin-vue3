<template>
    <div>
        <x-table
            class="my-sticky-header-column-table"

            :style="{height:getHeight}"
            :rows="rows"
            :columns="columns"
            :rows-per-page-options="[20,50,100]"

            row-key="name"
            selection="multiple"
            v-model:selected="selected"

            :btn-list="btnList"
            :search-list="searchList"
        >
        </x-table>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import XTable from "@/components/XTable/index.vue";
import {v4 as uuidv4} from "uuid";
import {useNavTabStore} from "@/store/settings/navigation";
import {SearchColumn} from "@/components/XTable/index";

const navTabStore = useNavTabStore()
const add = () => {
    navTabStore.currentNavTab = {
        id: uuidv4(),
        label:'新增模版',
        path:'/add',
        close: true
    }
}

const selected = ref([])
const btnList = [
    {color: 'primary', icon: 'o_add',label:'新增', tooltip: 'primary',onClick:add},
    {color: 'primary', icon: 'o_edit',label:'编辑', tooltip: 'amber-10'},
    {color: 'primary', icon: 'o_delete_outline',label:'删除', tooltip: 'red'},
    {color: 'primary', icon: 'o_download',label:'导出', tooltip: 'green-14'},
]
const searchList:SearchColumn[] = [
    {label:'test',name:'test1',value:'',components:'select'},
    {label:'test2',name:'test2',value:'',components:'input'},
    {label:'test4',name:'test4',value:'',components:'select'},
]
const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: (row: { name: any; }) => row.name,
        format: (val: any) => `${val}`,
        sortable: true
    },
    {name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true},
    {name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true},
    {name: 'carbs', label: 'Carbs (g)', field: 'carbs'},
    {name: 'protein', label: 'Protein (g)', field: 'protein'},
    {name: 'sodium', label: 'Sodium (mg)', field: 'sodium'},
    {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10)
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10)
    }
]
const rows = []
for (let i = 0; i < 100; i++) {
    rows.push(
        {
            name: 'Frozen Yogurt' + i,
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            sodium: 87,
            calcium: '14%',
            iron: '1%'
        },
    )
}
const offset = 46 + 36 + 50
const getHeight = computed(() => `calc(100vh - ${offset}px)`)
</script>

<style lang="sass">
</style>
