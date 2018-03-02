import { Injectable } from '@angular/core';

import { PrecioProducto } from '../models/producto.models';
import { BaseAjaxService } from '../../base/services/base-ajax.service';

@Injectable()
export class ListaPreciosService {
    // private catalogID = 401;

    constructor(private _db: BaseAjaxService) { }

    getPreciosPreductos(listaPreciosID: number, callback) {
        const params = this._db.createParameter('ECOM0001', 4, { 'V4': listaPreciosID });
        this._db.getData(params).subscribe(res => {
            // TODO: Handle Precio
            let precios: PrecioProducto[];
            if (res.Table1) {
                precios = res.Table1.map(item => {
                    const precio = new PrecioProducto(item.C1);
                    precio.precio = item.C11;
                    precio.listaPreciosID = listaPreciosID;
                    return precio;
                });
            }
            callback(precios);
        });
    }

    setPreciosProductos(listaPreciosID: number, precios: PrecioProducto[], callback) {
        const productsData = precios.map(p => `${p.productoID},${p.precio}`);
        const params = this._db.createParameter('ECOM0001', 3, { V3: listaPreciosID, V6: `C0,C1~${productsData.join('~')}` });
        this._db.getData(params).subscribe(() => { callback(); });
        // var qProd = 'C0,C1~' + ConvertToCSV(Enumerable.From($scope.allProductos).Select("x => { A: x['C0'], B: x['Precio'] }").ToArray(), ',', '~');
        // var qSuc = Enumerable.From($scope.allSucursales.findAll('Aplica', true)).Select(function (v) { return v.C0 }).ToArray();
        // ajax({ parameters: createParameter('ECOM0001', 2, { 'V3': $scope.DetailID, 'V6': qSuc.join(',') }), callback: function (res) { console.log(res.Table); $location.
    }
}
