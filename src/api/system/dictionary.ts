import {Data} from "@/api/system/menu";
import {xRequest} from "@/tools/http";

export function createDictionary(data: any): Promise<Data> {
    return xRequest.post({url: '/sysDictionary/createSysDictionary', data})
}
export function deleteSysDictionary(data: any): Promise<Data> {
    return xRequest.delete({url: '/sysDictionary/deleteSysDictionary', data})
}

export function updateSysDictionary(data: any): Promise<Data> {
    return xRequest.put({url: '/sysDictionary/updateSysDictionary', data})
}
export function getSysDictionaryList(params: any): Promise<Data> {
    return xRequest.get({url: '/sysDictionary/getSysDictionaryList', params})
}
export function findSysDictionary(params: any): Promise<Data> {
    return xRequest.get({url: '/sysDictionary/findSysDictionary', params})
}

export function createDictionaryDetail(data: any): Promise<Data> {
    return xRequest.post({url: '/sysDictionaryDetail/createSysDictionaryDetail', data})
}
export function deleteSysDictionaryDetail(data: any): Promise<Data> {
    return xRequest.delete({url: '/sysDictionaryDetail/deleteSysDictionaryDetail', data})
}
export function deleteSysDictionaryDetailByIds(data: any): Promise<Data> {
    return xRequest.delete({url: '/sysDictionaryDetail/deleteSysDictionaryDetailByIds', data})
}
export function updateSysDictionaryDetail(data: any): Promise<Data> {
    return xRequest.put({url: '/sysDictionaryDetail/updateSysDictionaryDetail', data})
}
export function getSysDictionaryDetailList(params: any): Promise<Data> {
    return xRequest.get({url: '/sysDictionaryDetail/getSysDictionaryDetailList', params})
}

export function getSysDictionaryDetailAllList(): Promise<Data> {
    return xRequest.get({url: '/sysDictionaryDetail/getSysDictionaryDetailAllList'})
}
