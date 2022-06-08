import {computed, ref} from "vue";
import {FormRef} from "@/components/XForm/index";
import {TreeRef} from "@/components/XTree/index";
import {TableRef} from "@/components/XTable/index";
import {useNavTabStore} from "@/store/settings/navigation";
import {v4 as uuidv4} from "uuid";
import {ListRef} from "@/components/XList/index";

const ActionTitle: any = {
    add: '新增',
    edit: '编辑',
    del: '删除',
}
export interface DetailRef{
    loadData:(id:any)=>void
}
export interface FormAreaRef{
    updateAreaLoading:(loading:boolean)=>void
}

export const actionTitle = (title: string) => {
    const action = ref<string>('add')
    const getTitle = computed(() => {
        return ActionTitle[action.value]
    })

    return {
        action,
        getTitle
    }
}
export const actionRef = () => {
    const formRef = ref<FormRef | null>(null)
    const treeRef = ref<TreeRef | null>(null)
    const listRef = ref<ListRef | null>(null)
    const tableRef = ref<TableRef | null>(null)
    const detailRef = ref<DetailRef | null>(null)
    const formAreaRef = ref<FormAreaRef | null>(null)

    return {
        formRef,
        treeRef,
        tableRef,
        listRef,
        detailRef,
        formAreaRef,
    }
}

export const actionNavTab = () => {
    const navTabStore = useNavTabStore()
    const toTab = (id: any, path: string) => {
        const ID = id || uuidv4()
        navTabStore.currentNavTab = {
            ID,
            path,
            close: true
        }
    }

    return {
        toTab
    }
}

export const actionLoading = (...tags: string[]) => {
    const loadings = ref<any>({})
    tags.forEach(tag => {
        loadings.value[tag] = false
    })

    return {
        loadings,
    }
}

export const actionConst = () => {
    const search = ref({})
    const tableSelected = ref([])
    const treeSelected = ref<any>()
    const treeTicked = ref<any[]>([])

    return {
        search,
        tableSelected,
        treeSelected,
        treeTicked
    }
}

export const actionCondition = (treeSelected:any,treeTicked:any) => {
    const isEdit = computed(() => {
        if (treeSelected.value) return false
        if (treeTicked.value.length === 1) return false
        return true
    })
    const isDel = computed(() => {
        if (treeSelected.value) return false
        if (treeTicked.value.length > 0) return false
        return true
    })

    return {
        isEdit,
        isDel,
    }
}
