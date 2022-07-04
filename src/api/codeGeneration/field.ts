import { xRequest } from '@/tools/http';

export function getDB(): Promise<any> {
    return xRequest.get({ url: '/admin-api/autoCode/getDB' });
}
export function getTables(dbName:string): Promise<any> {
    return xRequest.get({ url: '/admin-api/autoCode/getTables', params: { dbName } });
}
export function getColumn(params:{tableName:string, dbName:string}): Promise<any> {
    return xRequest.get({ url: '/admin-api/autoCode/getColumn', params });
}
export function updateFieldConfig(data:{tablesName:string, dbName:string, fieldsConfig:string}): Promise<any> {
    return xRequest.put({ url: '/admin-api/fieldConfig/updateFieldConfig', data });
}
export function getFieldConfigList(): Promise<any> {
    return xRequest.post({ url: '/admin-api/fieldConfig/getFieldConfigList' });
}
export function genCode(data:any): Promise<any> {
    return xRequest.post({ url: '/admin-api/fieldConfig/genCode', data });
}
