export type ResultCode = 
0 /*Success*/ | 
1 /*Authentication Issue*/ |
2 /*General Error*/;

export class AjaxRequestResult{
    data: any;
    error: any;

    constructor(public code: ResultCode, info: any){
        switch(code){
            case 0:
                this.data = info;
                break;
            case 1:
                this.error = info.Auth;
                break;
            default:
                this.error = info;
                break;
        }
    }
}