import {xRequest} from "@/tools/http";

export interface CaptchaResponse {
    captchaId: string
    picPath: string
}
export interface LoginRequest {
    username:string,
    password:string,
    captcha:string,
    captchaId:string,
}
export interface Authority {
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt?: any;
    authorityId: string;
    authorityName: string;
    parentId: string;
    dataAuthorityId?: any;
    children?: any;
    menus?: any;
    defaultRouter: string;
}
export interface Authority2 {
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt?: any;
    authorityId: string;
    authorityName: string;
    parentId: string;
    dataAuthorityId?: any;
    children?: any;
    menus?: any;
    defaultRouter: string;
}
export interface User {
    ID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    uuid: string;
    userName: string;
    nickName: string;
    sideMode: string;
    headerImg: string;
    baseColor: string;
    activeColor: string;
    authorityId: string;
    authority: Authority;
    authorities: Authority2[];
}
export interface LoginResponse {
    user: User;
    token: string;
    expiresAt: number;
}

export function getCaptcha():Promise<CaptchaResponse>{
    return xRequest.get({url:'/base/captcha',headers:{ignoreAuth:true},params:new Date().getTime()})
}

export function login(data:LoginRequest):Promise<LoginResponse> {
    return xRequest.post({url:'/base/login',headers:{ignoreAuth:true},data})
}
