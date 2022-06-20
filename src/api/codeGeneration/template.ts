import { xRequest } from '@/tools/http';

export function getCodeTemplateTree(data: any): Promise<any> {
    return xRequest.post({ url: '/codeTemplate/getCodeTemplateTree', data });
}
export function createCodeTemplate(data: any): Promise<any> {
    return xRequest.post({ url: '/codeTemplate/createCodeTemplate', data });
}
export function deleteCodeTemplate(data: any): Promise<any> {
    return xRequest.delete({ url: '/codeTemplate/deleteCodeTemplate', data });
}
export function updateCodeTemplate(data: any): Promise<any> {
    return xRequest.put({ url: '/codeTemplate/updateCodeTemplate', data });
}
