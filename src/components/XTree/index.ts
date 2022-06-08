import XTree from "@/components/XTree/index.vue";
import XInputTree from "@/components/XTree/XInputTree.vue";
export {
    XTree,
    XInputTree,
}

export interface TreeRef {
    loadData: () => void,
    updateTicked: (tickedList:any) => void,
}

