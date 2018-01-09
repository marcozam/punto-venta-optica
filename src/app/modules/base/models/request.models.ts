import * as moment from 'moment';

export type ResultCode = 'Success' | 'AuthError' | 'GeneralError';

export class AjaxRequestResult{
    data: any;
    error: any;

    constructor(public code: ResultCode, info: any){
        switch(code){
            case 'Success':
                this.data = info;
                break;
            case 'AuthError':
                this.error = info.Auth;
                break;
            default:
                this.error = info;
                break;
        }
    }
}

export class AjaxLocalStorage<T>{
    
    minutesOld(time): number{
        let today = moment(new Date());
        let _time = moment(time);
        let duration = moment.duration(today.diff(_time));
        return duration.asMinutes();
    }

    constructor(public storageName: string, public storageDuration: number){ }

    cleanStorage(){
        sessionStorage.removeItem(this.storageName);
    }

    setStorage(data: any, userID: number, storageName?: string){
        storageName = storageName ? storageName : this.storageName;
        let _storage = new Storage(userID, new Date().getTime(), data);
        sessionStorage.setItem(storageName, JSON.stringify(_storage));
    }

    getStorage(storageName?: string): T[]{
        storageName = storageName ? storageName : this.storageName;
        let dataSaved = sessionStorage.getItem(storageName);
        if(dataSaved){
            let _storage: Storage = JSON.parse(dataSaved);
            if(this.minutesOld(_storage.date) <= this.storageDuration || this.storageDuration === 0){
                return _storage.data;
            }
            else{
                this.cleanStorage();
            }
        }
        return null;
    }
}

export class Storage{
    constructor(
        public userID: number,
        public date: number,
        public data: any)
    { }
}