import { xRequest } from '@/tools/http';
import { NavTab } from '@/store/settings/navigation';
import { BaseObj } from '@/types';

export interface Data {
    menus: NavTab[];
    menu:NavTab;
    list:any[];
    detail:any;
    authority:any;
    apis:any;
    paths:any;
}

export function getBaseMenuTree():Promise<Data> {
    return xRequest.get({ url: '/admin-api/menu/getBaseMenuTree' });
}

export function getMenuList():Promise<Data> {
    return xRequest.post({ url: '/admin-api/menu/getMenuList', data: { page: 1, pageSize: 1000 } });
}

export function getMenuAuthority(data:any):Promise<Data> {
    return xRequest.post({ url: '/admin-api/menu/getMenuAuthority', data });
}

export function getBaseMenuById(data:any):Promise<Data> {
    return xRequest.post({ url: '/admin-api/menu/getBaseMenuById', data });
}

export function getBaseMenuByParentId(data:any):Promise<Data> {
    return xRequest.post({ url: '/admin-api/menu/getBaseMenuByParentId', data });
}

export function addMenu(data:BaseObj):Promise<Data> {
    return xRequest.post({ url: '/admin-api/menu/addBaseMenu', data });
}

export function updateMenu(data:BaseObj):Promise<Data> {
    return xRequest.put({ url: '/admin-api/menu/updateBaseMenu', data });
}

export function addMenuAuthority(data:any):Promise<Data> {
    return xRequest.post({ url: '/admin-api/menu/addMenuAuthority', data });
}

export function deleteMenu(data:any):Promise<Data> {
    return xRequest.delete({ url: '/admin-api/menu/deleteBaseMenu', data });
}
