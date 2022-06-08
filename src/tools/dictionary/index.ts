import {settingsEnum} from "@/tools/http";

export enum DictionaryEnum {
    API_METHOD_TYPE=14
}

export const getDictionaryById = (id:DictionaryEnum,value?:any):any => {
    const dictionaryList = JSON.parse(sessionStorage.getItem(settingsEnum.DICTIONARY)||'[]')
    let result = dictionaryList.filter((item:any)=>item.sysDictionaryID==id)
    if (!value) return result.map((item:any)=>({label:item.label,value:item.value}))

    result = result.find((item:any)=>item.value==value)
    if (result) return result.label

    return null
}
