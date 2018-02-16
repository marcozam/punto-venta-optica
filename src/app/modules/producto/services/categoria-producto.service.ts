import { Injectable } from '@angular/core';

// Models
import { CategoriaProductoSumary } from '../models/producto.models';
// Services
import { BaseAjaxService } from '../../base/services/base-ajax.service';
import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

@Injectable()
export class CategoriaProductoService extends GenericService<CategoriaProductoSumary> implements GenericServiceBase<CategoriaProductoSumary> {

    constructor(private _db: BaseAjaxService) {
        super(_db, 'os_categoria_producto', 360);
        this.catalogID = 403;
    }

    newInstance() { return new CategoriaProductoSumary(''); }

    getStandAloneCategories() {
        const storageName = 'os_standalone_categoria_producto';
        this.getBaseList(() => {
            const $sub = this._db.getAllDataFromCatalog(this.catalogID, '40302,0')
                .subscribe((result: any[]) => {
                    this.setData(this.mapList(result), false, storageName);
                    $sub.unsubscribe();
                });
        }, storageName);
    }

    getStockCategories() {
        const storageName = 'os_stock_categoria_producto';
        this.getBaseList(() => {
            const $sub = this._db.getAllDataFromCatalog(this.catalogID, '40304,1')
                .subscribe((result: any[]) => {
                    this.setData(this.mapList(result), false, storageName);
                    $sub.unsubscribe();
                });
        }, storageName);
    }
}
