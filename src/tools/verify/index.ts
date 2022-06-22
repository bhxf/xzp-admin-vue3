const checkNumber = /^[0-9]+$/;

export const isEmpty = (val:any) => !val;
export const isNumber = (val:any) => checkNumber.test(val);
