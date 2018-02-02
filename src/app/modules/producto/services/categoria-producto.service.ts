import { Injectable } from '@angular/core';

import { BaseAjaxService } from '../../base/services/base-ajax.service'
import { CategoriaProducto, CategoriaProductoSumary } from '../models/producto.models';
import { Subject } from 'rxjs';
import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

@Injectable()
export class CategoriaProductoService extends GenericService<CategoriaProductoSumary> implements GenericServiceBase<CategoriaProductoSumary> {
    
    constructor(private _db: BaseAjaxService) { 
        super(_db, 'os_categoria_producto', 360);
        this.catalogID = 403;
    }

    newInstance() { return new CategoriaProductoSumary(''); }

    getStandAloneCategories(){
        let storageName = 'os_standalone_categoria_producto';
        this.getBaseList(()=>{
            console.log('Getting data from server');
            this._db.getAllDataFromCatalog(this.catalogID, '40302,0')
                .subscribe((result: any[]) => this.setData(this.mapList(result), false, storageName));
        }, storageName);
    }

    getStockCategories(){
        let storageName = 'os_stock_categoria_producto';
        this.getBaseList(()=>{
            this._db.getAllDataFromCatalog(this.catalogID, '40304,1')
                .subscribe((result: any[]) => this.setData(this.mapList(result), false, storageName));
        }, storageName);
    }
}