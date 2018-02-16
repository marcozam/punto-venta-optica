import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { MovimientoInventario, TipoMovimientoInventario } from 'app/modules/inventario/models/inventario.models';
import { Producto, CategoriaProductoSumary } from 'app/modules/producto/models/producto.models';

@Injectable()
export class MovimientosInventarioService {

    private catalogoTipoMovimientoInventario = 802;

    constructor(private osBD: BaseAjaxService) { }

    mapList(list: any[]) { return list.map(p => this.mapData(p)); }

    mapData(item: any) {
        // Categoria
        const cat = new CategoriaProductoSumary(item.C4);
        cat.key = item.C3;
        // Producto
        const prod = new Producto(item.C1, cat);
        prod.key = item.C0;
        prod.categoriaProductoID = item.C3;
        // Tipo Movimiento
        const tm = new TipoMovimientoInventario();
        tm.key = item.C6;
        tm.nombre = item.C7;
        // Movimiento
        const mi = new MovimientoInventario(prod);
        mi.producto = prod;
        mi.cantidad = item.C5;
        mi.tipoMovimiento = tm;
        // Fecha
        mi.fecha = moment(item.C9).toDate();
        // item.C9
        return mi;
    }

    getMovimientos(sucursalID: number, fechaInicio: Date, fechaFin: Date, callback) {
        const params = this.osBD.createParameter('INV0002', 1, {
            'V4': sucursalID,
            'V6': fechaInicio.toJSON(),
            'V7': fechaFin.toJSON()
        });
        this.osBD.getData(params).subscribe(res => { callback(this.mapList(res.Table)); });
    }

    getTipoMovimientos(callback) {
        this.osBD.getAllDataFromCatalog(this.catalogoTipoMovimientoInventario)
            .subscribe((res: any[]) => {
                callback(res.map(tm => {
                    const item = new TipoMovimientoInventario();
                    item.key = tm.C0;
                    item.nombre = tm.C1;
                    return item;
                }));
            });
    }
}
