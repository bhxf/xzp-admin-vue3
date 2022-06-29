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
export function updateFieldConfig(data:{tablesName:string, dbName:string, fieldsConfig:string}): Promise<any> {
    return xRequest.put({ url: '/fieldConfig/updateFieldConfig', data });
}
export function getFieldConfigList(): Promise<any> {
    return xRequest.post({ url: '/fieldConfig/getFieldConfigList' });
}
export function genCode(data:any): Promise<any> {
    return xRequest.post({ url: '/fieldConfig/genCode', data });
}
