import { SettingsEnum } from '@/tools/http';

export enum DictionaryEnum {
    API_METHOD_TYPE=14,
    GO_TYPE=15,
    FORM_TYPE=16,
    LIST_TYPE=16,
}

export const getDictionaryByType = (id:DictionaryEnum, value?:any):any => {
    const dictionaryList = JSON.parse(sessionStorage.getItem(SettingsEnum.DICTIONARY) || '[]');
    let result = dictionaryList.filter((item:any) => item.sysDictionaryID === id);

    console.log(result);

    if (!value) return result.map((item:any) => ({ label: item.label, value: item.value }));

    result = result.find((item:any) => item.value === value);
    if (result) return result.label;

    return null;
};
