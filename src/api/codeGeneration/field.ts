import { xRequest } from '@/tools/http';

export function getDB(): Promise<any> {
    return xRequest.get({ url: '/autoCode/getDB' });
}
export function getTables(dbName:string): Promise<any> {
    return xRequest.get({ url: '/autoCode/getTables', params: { dbName } });
}
export function getColumn(params:{tableName:string, dbName:string}): Promise<any> {
    return xRequest.get({ url: '/autoCode/getColumn', params });
}
