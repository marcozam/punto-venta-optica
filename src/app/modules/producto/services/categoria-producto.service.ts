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

    newInstance(){
        return new CategoriaProductoSumary('');
    }

    mapData(r: any){
        let _cat = new CategoriaProductoSumary(r.C1);
        _cat.key = r.C0;
        _cat.catalogoID = r.C2;
        _cat.formatoNombre = r.C3;
        _cat.usaInventario = r.C4;
        return _cat;
    }

    getStandAloneCategories(){
        let storageName = 'os_standalone_categoria_producto';
        this.getBaseList(()=>{
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

    save(item: CategoriaProductoSumary, callback){
        let fields = [
            `40301,${item.nombre}`,
            `40302,${item.catalogoID}`,
            `40303,${item.formatoNombre ? item.formatoNombre: ''}`,
            `40304,${item.usaInventario ? '1': '0'}`,
        ]
        let d2s = fields.join('~');
        this._db.saveDynamicCatalog(d2s, this.catalogID, item.key, r => callback(this.mapData(r)));
    }
}