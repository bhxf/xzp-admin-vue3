import { xRequest } from '@/tools/http';
import { Data } from '@/api/system/menu';

export function changePassword(data:any):Promise<Data> {
    return xRequest.post({ url: '/user/changePassword', data });
}
