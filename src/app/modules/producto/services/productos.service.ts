import { Injectable } from '@angular/core';

import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

import { Producto } from '../models/producto.models';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProductosService extends GenericService<Producto> implements GenericServiceBase<Producto> {
    constructor(_osBD: BaseAjaxService) {
        super(_osBD, 'os_producto', 360);
        this.catalogID = 402;
    }

    getProductsByCategory(categoryID: number) {
        if(!isNaN(categoryID)){
            let storageName = `os_producto_categoria-${categoryID}`;
            this.getBaseList(()=>{
                this.db.getAllDataFromCatalog<Producto>(this.catalogID, `40202,${categoryID}`)
                    .subscribe((result: any[]) => {
                        this.setData(this.mapList(result), true, storageName)
                    });
            }, storageName, true);
        }
    }

    getProductByDetail(ID: number, categoryID: number){
        return this.db.getAllDataFromCatalog(this.catalogID, `40202,${categoryID}~40206,${ID}`)
            .map((result: any) => result.length > 0 ? this.mapData(result[0]) : new Producto(''));
    }

    mapData(r: any) {
        if(r){
            const item = this.newInstance();
            item.key = r.C0;
            item.nombre = r.C1;
            item.categoriaProductoID = r.C2;
            item.requireProcesamiento = r.C4;
            item.SKU = r.C5;
            item.detalleID = r.C6;
            return item;
        }
    }

    newInstance(): Producto {
        return new Producto('');
    }

    hasChanges(value1: Producto, value2: Producto) {
        return value1.nombre !== value2.nombre
            || value1.descripcion !== value2.descripcion
            //|| value1.requireProcesamiento !== value2.requireProcesamiento
            //|| value1.usaInventario !== value2.usaInventario
            || value1.SKU !== value2.SKU;
    }

    save(workingItem: Producto, callback, error?, storageName?) {
        this.basicSave(workingItem, (producto: Producto) => {
            const params = this.db.createParameter('ECOM0005', 1, {
                V3: producto.key,
                V4: producto.nombre,
                //V5: _producto.usaInventario ? 1 : 0,
                V6: producto.requireProcesamiento ? 1 : 0,
                V9: producto.categoriaProductoID,
                V7: producto.SKU,
                V8: producto.detalleID ? producto.detalleID : 0
            })
            //TODO
            this.db.getData(params)
            .map(result => result.Table.length > 0 ? this.mapData(result.Table[0]) : null)
            .subscribe((data: Producto) => {
                if(data){
                    this.addItem(data, storageName);
                    callback(data);
                }
                else if(error) error();
            });
        });
    }
}
