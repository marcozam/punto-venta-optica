import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { environment } from './../../../../environments/environment';

import { AjaxGuardService } from './ajax-guard.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { BaseGenericCatalog, GenericCatalog } from 'app/modules/generic-catalogs/models/generic-catalogs.models';
import { AjaxRequestResult } from 'app/modules/base/models/request.models';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BaseAjaxService{
    online: boolean;

    constructor(private _dialog: DialogBoxService, public guard: AjaxGuardService) 
    {
        this.guard.online$.subscribe((isOnline)=>{
            this.online = isOnline;
            if(!isOnline) this._dialog.openDialog('Error', 'Se perdio la conexion a internet', false);
        })
    }

    private jsonToString(myObject) {
        var line = [];
        Object.keys(myObject).forEach(k=>{
            line.push(`${k}=${myObject[k]}|`);
        });
        return line.join('');
    }

    createParameter = function (spName, option, parameters?) {
        let account = { C0: 1, C3: ''};
        //JSON.parse(localStorage.getItem('CuentaActiva')), 
        let user = { C0: environment.defaultUser };
        //JSON.parse(localStorage.getItem('User'));
        let paramsFields = {
            'SP': spName,
            'DBID': environment.DBID,
            'V0': option,
            'V1': (account ? account.C0 : 0),
            'V2': (user ? user.C0 : 0)
        }
        var retStr = this.jsonToString(paramsFields);
        if (parameters) {
            retStr += this.jsonToString(parameters);
        }
        return { 'Parametros': retStr };
    }

    getData(data: any): Observable<any>{
        let response: Subject<any> = new Subject();
        if(this.online){
            this.guard.getData(environment.webServiceURL, data)
                .subscribe(
                    (result: AjaxRequestResult) => {
                        response.next(result.data);
                    },
                    (result: AjaxRequestResult) =>{
                        response.next({Table: []});
                        if(!this._dialog.isOpen){
                            this._dialog.openDialog('Error', result.code === 1 ? 'Problema de Autenticacion' : 'Ha ocurrido un error', false);
                        }
                    });
        }
        else if(!this._dialog.isOpen) this._dialog.openDialog('Error', 'No hay conexion', false);
        return response;
    }

    getDetailedData<T>(CatalogoID: number, DetailID: any) {
        var params = this.createParameter('DYN0001', 1, { 'V4': CatalogoID, 'V5': DetailID });
        return this.getData(params).map(result => result.Table.length > 0 ? result.Table[0] : null);
    }

    getAllDataFromCatalog<T>(CatalogoID: number, options?): Observable<T[]> {
        var tOption = { where: '' }
        if(options){
            if(typeof(options) == 'string'){
                tOption.where = 'C0,C1~' + options;
            }
            else{
                tOption = Object.assign(tOption, options);
                tOption.where = 'C0,C1~' + tOption.where;
            }
        }
        return this.getData(this.createParameter('DYN0001', 1, { V4: CatalogoID, V98: tOption.where }))
            .map(result => result.Table);
    }

    saveDynamicCatalog(DatosCatalogo: string, CatalogoID: number, DetailID: any, callback) {
        var params = this.createParameter('DYN0001', 3, { 'V4': CatalogoID, 'V5': DetailID ? DetailID : 0, 'V6': 'C0,C1,C2~' + DatosCatalogo });
        this.getData(params).subscribe(res => {
            if(res.Table.length == 1)
            {
                callback(res.Table[0]);
            }
            //throw error if empty
        });
    }

    removeItem(CatalogoID: number, DetailID: any) {
        var params = this.createParameter('DYN0001', 5, { 'V4': CatalogoID, 'V5': DetailID });
        return this.getData(params)
            .map(result => result.Table);
    }

    mapGeneric(r){
        let item = new GenericCatalog();
        item.key = r.C0;
        item.nombre = r.C1;
        return item;
    }
}