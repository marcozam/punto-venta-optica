import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';
// Services
import { AjaxGuardService } from './ajax-guard.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
// Models
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { AjaxRequestResult } from 'app/modules/base/models/request.models';
// Constants
import { WarningTitle, AuthErrorMessage, ErrorTitle, InternalServerErrorMessage } from 'app/modules/base/constants/messages.contants';

@Injectable()
export class BaseAjaxService {
    online: boolean;

    constructor(private _dialog: DialogBoxService, public guard: AjaxGuardService, public snackBar: MatSnackBar) {
        this.guard.online$.subscribe((isOnline) => {
            this.online = isOnline;
            if (!isOnline) { this.snackBar.open('Se perdio la conexion a internet', 'Ignorar', { duration: 3000 }); }
        });
    }

    private jsonToString(myObject) {
        let line = [];
        Object.keys(myObject).forEach(k => {
            line = line.concat([`${k}=${myObject[k]}|`]);
        });
        return line.join('').trim();
    }

    createParameter(spName, option, parameters?) {
        const account = { C0: 1, C3: ''};
        // JSON.parse(localStorage.getItem('CuentaActiva')),
        const user = { C0: environment.defaultUser };
        // JSON.parse(localStorage.getItem('User'));
        const paramsFields = {
            'SP': spName,
            'DBID': environment.DBID,
            'V0': option,
            'V1': (account ? account.C0 : 0),
            'V2': (user ? user.C0 : 0)
        };
        let retStr = this.jsonToString(paramsFields);
        if (parameters) { retStr += this.jsonToString(parameters); }
        return { 'Parametros': retStr };
    }

    getData(data: any): Observable<any> {
        const response: Subject<any> = new Subject();
        if (this.online || !environment.production) {
            this.guard.getData(environment.webServiceURL, data)
                .subscribe(
                    (result: AjaxRequestResult) => {
                        switch (result.code) {
                            case 'Success':
                                response.next(result.data);
                                break;
                            case 'AuthError':
                                this.openDialog(WarningTitle, AuthErrorMessage);
                                // response.next();
                                break;
                            // General Error
                            default:
                                this.openDialog(ErrorTitle, InternalServerErrorMessage);
                                // response.next();
                                break;
                        }
                    });
        } else { this.openDialog(ErrorTitle, 'No hay conexion'); }
        return response;
    }

    private openDialog(title: string, message: string) {
        if (!this._dialog.isOpen) { this._dialog.openDialog(title, message); }
    }

    getDetailedData<T>(CatalogoID: number, DetailID: any): Observable<T> {
        const params = this.createParameter('DYN0001', 1, { 'V4': CatalogoID, 'V5': DetailID });
        return this.getData(params).map(result => result.Table.length > 0 ? result.Table[0] : null);
    }

    getAllDataFromCatalog<T>(CatalogoID: number, options?): Observable<T[]> {
        let tOption = { where: '' };
        if (options) {
            if (typeof(options) === 'string') {
                tOption.where = 'C0,C1~' + options;
            } else {
                tOption = Object.assign(tOption, options);
                tOption.where = 'C0,C1~' + tOption.where;
            }
        }
        return this.getData(this.createParameter('DYN0001', 1, { V4: CatalogoID, V98: tOption.where }))
            .map(result => result.Table);
    }

    saveDynamicCatalog(DatosCatalogo: string, CatalogoID: number, DetailID: any, callback?) {
        const params = this.createParameter('DYN0001', 3, { 'V4': CatalogoID, 'V5': DetailID ? DetailID : 0, 'V6': 'C0,C1,C2~' + DatosCatalogo });
        const respond = this.getData(params).map(res => res.Table.length >= 1 ? res.Table[0] : null);
        if (callback) { respond.subscribe(res => callback(res)); }
        return respond;
    }

    removeItem(CatalogoID: number, DetailID: any) {
        const params = this.createParameter('DYN0001', 5, { 'V4': CatalogoID, 'V5': DetailID });
        return this.getData(params).map(result => result.Table);
    }

    mapGeneric(r) {
        const item = new GenericCatalog();
        item.key = r.C0;
        item.nombre = r.C1;
        return item;
    }
}
