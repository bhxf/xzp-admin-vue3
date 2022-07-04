import { Data } from '@/api/system/menu';
import { xRequest } from '@/tools/http';

export function createDictionary(data: any): Promise<Data> {
    return xRequest.post({ url: '/admin-api/sysDictionary/createSysDictionary', data });
}
export function deleteSysDictionary(data: any): Promise<Data> {
    return xRequest.delete({ url: '/admin-api/sysDictionary/deleteSysDictionary', data });
}

export function updateSysDictionary(data: any): Promise<Data> {
    return xRequest.put({ url: '/admin-api/sysDictionary/updateSysDictionary', data });
}
export function getSysDictionaryList(params: any): Promise<Data> {
    return xRequest.get({ url: '/admin-api/sysDictionary/getSysDictionaryList', params });
}
export function findSysDictionary(params: any): Promise<Data> {
    return xRequest.get({ url: '/admin-api/sysDictionary/findSysDictionary', params });
}

export function createDictionaryDetail(data: any): Promise<Data> {
    return xRequest.post({ url: '/admin-api/sysDictionaryDetail/createSysDictionaryDetail', data });
}
export function deleteSysDictionaryDetail(data: any): Promise<Data> {
    return xRequest.delete({ url: '/admin-api/sysDictionaryDetail/deleteSysDictionaryDetail', data });
}
export function deleteSysDictionaryDetailByIds(data: any): Promise<Data> {
    return xRequest.delete({ url: '/admin-api/sysDictionaryDetail/deleteSysDictionaryDetailByIds', data });
}
export function updateSysDictionaryDetail(data: any): Promise<Data> {
    return xRequest.put({ url: '/admin-api/sysDictionaryDetail/updateSysDictionaryDetail', data });
}
export function getSysDictionaryDetailList(params: any): Promise<Data> {
    return xRequest.get({ url: '/admin-api/sysDictionaryDetail/getSysDictionaryDetailList', params });
}

export function getSysDictionaryDetailAllList(): Promise<Data> {
    return xRequest.get({ url: '/admin-api/sysDictionaryDetail/getSysDictionaryDetailAllList' });
}
