import { Injectable } from '@angular/core';
import { MetodoPago } from 'app/modules/venta/models/venta.models';
import { BaseAjaxService } from '../../base/services/base-ajax.service'
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';

@Injectable()
export class MetodosPagoService extends GenericService<MetodoPago> implements GenericServiceBase<MetodoPago> {
    
    constructor(_db: BaseAjaxService) {
        super(_db);
        this.catalogID = 304;
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
}