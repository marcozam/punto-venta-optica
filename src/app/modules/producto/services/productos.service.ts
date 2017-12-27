import { Injectable } from '@angular/core';

import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

import { Producto } from '../models/producto.models';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProductosService extends GenericService<Producto> implements GenericServiceBase<Producto> {
    constructor(_osBD: BaseAjaxService) {
        super(_osBD);
        this.catalogID = 402;
    }

    getProductsByCategory(categoryID: number) {
        if(!isNaN(categoryID)){
            this.startLoading();
            this.db.getAllDataFromCatalog<Producto>(this.catalogID, `40202,${categoryID}`)
            .subscribe((result: any[]) => {
                this.source$.next(this.mapList(result));
                this.finishLoading();
            });
        }
    }

    getProductByDetail(ID: number, categoryID: number){
        return this.db.getAllDataFromCatalog(this.catalogID, `40202,${categoryID}~40206,${ID}`)
            .map((result: any) => result ? this.mapData(result[0]) : new Producto(''));
    }

    mapData(r: any) {
        const item = new Producto(r.C1);
        item.key = r.C0;
        item.categoriaProductoID = r.C2;
        item.requireProcesamiento = r.C4;
        item.SKU = r.C5;
        item.detalleID = r.C6;
        return item;
    }

    hasChanges(value1: Producto, value2: Producto) {
        return value1.nombre !== value2.nombre
            || value1.descripcion !== value2.descripcion
            //|| value1.requireProcesamiento !== value2.requireProcesamiento
            //|| value1.usaInventario !== value2.usaInventario
            || value1.SKU !== value2.SKU;
    }

    save(_producto: Producto, _workingCopy: Producto, callback) {
        if (this.hasChanges(_producto, _workingCopy)) {
            _producto = Object.assign(_producto, _workingCopy);
            const params = this.db.createParameter('ECOM0005', 1, {
                V3: _producto.key,
                V4: _producto.nombre,
                //V5: _producto.usaInventario ? 1 : 0,
                V6: _producto.requireProcesamiento ? 1 : 0,
                V9: _producto.categoriaProductoID,
                V7: _producto.SKU,
                V8: _producto.detalleID ? _producto.detalleID : 0
            })
            this.db.getData(params).subscribe(r => callback(r));
        }
        else{
            callback(_producto);
        }
    }
}
