import { Injectable } from '@angular/core';
import { MetodoPago } from '../models/venta.models';
import { BaseAjaxService } from '../../base/services/base-ajax.service'
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';

@Injectable()
export class MetodosPagoService implements GenericServiceBase<MetodoPago> {
    private catalogID: number = 304;

    constructor(private _db: BaseAjaxService) {

    }

    hasChanges(value1: MetodoPago, value2: MetodoPago): void {
        throw new Error("Method not implemented.");
    }
    save(_currentValue: MetodoPago, _newValue: MetodoPago, callback?: any): void {
        throw new Error("Method not implemented.");
    }
    mapData(object: any) {
        let item = new MetodoPago();
        item.key = object.C0;
        item.nombre = object.C1;
        item.enVenta = object.C2;
        item.enCorte = object.C3;
        item.utilizaReferencia = object.C4;
        return item;
    }

    mapList(items: any[]){
        return items.map(i=>{
            return this.mapData(i);
        })
    }

    getList(callbak){
        this._db.getAllDataFromCatalog(this.catalogID, (res:any[]) => {
            callbak(this.mapList(res));
        })
    }
}