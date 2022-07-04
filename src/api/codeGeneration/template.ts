import { xRequest } from '@/tools/http';

export function getCodeTemplateTree(data: any): Promise<any> {
    return xRequest.post({ url: '/admin-api/codeTemplate/getCodeTemplateTree', data });
}
export function getCodeTemplate(params: any): Promise<any> {
    return xRequest.get({ url: '/admin-api/codeTemplate/getCodeTemplate', params });
}
export function createCodeTemplate(data: any): Promise<any> {
    return xRequest.post({ url: '/admin-api/codeTemplate/createCodeTemplate', data });
}
export function deleteCodeTemplate(data: any): Promise<any> {
    return xRequest.delete({ url: '/admin-api/codeTemplate/deleteCodeTemplate', data });
}
export function updateCodeTemplate(data: any): Promise<any> {
    return xRequest.put({ url: '/admin-api/codeTemplate/updateCodeTemplate', data });
}
export function updateCodeTemplateContext(data: any): Promise<any> {
    return xRequest.put({ url: '/admin-api/codeTemplate/updateCodeTemplateContext', data });
}
