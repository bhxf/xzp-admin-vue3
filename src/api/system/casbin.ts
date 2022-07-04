import { Data } from '@/api/system/menu';
import { xRequest } from '@/tools/http';

export function updateCasbin(data:any): Promise<Data> {
    return xRequest.put({ url: '/admin-api/casbin/updateCasbin', data });
}
