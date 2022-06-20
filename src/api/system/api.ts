import { xRequest } from '@/tools/http';
import { Data } from '@/api/system/menu';

export function getApiList(data: any): Promise<Data> {
    return xRequest.post({ url: '/api/getApiList', data });
}

export function getAllApis(): Promise<Data> {
    return xRequest.post({ url: '/api/getAllApis' });
}

export function getPolicyPathByAuthorityId(data:any): Promise<Data> {
    return xRequest.post({ url: '/casbin/getPolicyPathByAuthorityId', data });
}

export function createApi(data: any): Promise<Data> {
    return xRequest.post({ url: '/api/createApi', data });
}

export function updateApi(data: any): Promise<Data> {
    return xRequest.put({ url: '/api/updateApi', data });
}

export function deleteApi(data: any): Promise<Data> {
    return xRequest.delete({ url: '/api/deleteApi', data });
}

export function deleteApisByIds(data: any): Promise<Data> {
    return xRequest.delete({ url: '/api/deleteApisByIds', data });
}
