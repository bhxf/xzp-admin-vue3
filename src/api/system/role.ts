import { xRequest } from '@/tools/http';
import { Data } from '@/api/system/menu';

export function getAuthorityList():Promise<Data> {
    return xRequest.post({ url: '/admin-api/authority/getAuthorityList' });
}
export function createAuthority(data:any):Promise<Data> {
    return xRequest.post({ url: '/admin-api/authority/createAuthority', data });
}
export function updateAuthority(data:any):Promise<Data> {
    return xRequest.put({ url: '/admin-api/authority/updateAuthority', data });
}
export function findAuthority(data:any):Promise<Data> {
    return xRequest.post({ url: '/admin-api/authority/findAuthority', data });
}
export function deleteAuthority(data:any):Promise<Data> {
    return xRequest.delete({ url: '/admin-api/authority/deleteAuthority', data });
}
