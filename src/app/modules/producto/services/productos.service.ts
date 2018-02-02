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
        let respond$ = new Subject();
        if(!isNaN(categoryID)){
            this.startLoading();
            let storageName = `os_producto_categoria-${categoryID}`;
            
            let localData = this.getLocalData(storageName);
            if(localData) setTimeout(() => respond$.next(localData), 200);
            else {
                this.db.getAllDataFromCatalog<Producto>(this.catalogID, `40202,${categoryID}`)
                    .subscribe((result: any[]) => {
                        this.setData(result, false, storageName, true);
                        respond$.next(this.mapList(result));
                    });
            }
        }
        return respond$.asObservable();
    }

    getProductByDetail(ID: number, categoryID: number){
        return this.db.getAllDataFromCatalog(this.catalogID, `40202,${categoryID}~40206,${ID}`)
            .map((result: any) => result.length > 0 ? this.mapData(result[0]) : new Producto(''));
    }

    newInstance(): Producto { return new Producto(''); }

    save(workingItem: Producto, callback, error?, storageName?) {
        return this.basicSave(workingItem, (producto: Producto) => {
            const params = this.db.createParameter('ECOM0005', 1, {
                V3: producto.key,
                V4: producto.nombre,
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
