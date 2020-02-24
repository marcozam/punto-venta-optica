import { Injectable } from '@angular/core';
// RxJs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { MovimientoInventario, TipoMovimientoInventario } from 'models/inventario';
import { Producto, CategoriaProductoSumary } from 'app/modules/producto/models/producto.models';

@Injectable()
export class MovimientosInventarioService {

  private catalogoTipoMovimientoInventario = 802;

  constructor(private osBD: BaseAjaxService) { }

  mapList(list: any[]) { return list.map(p => this.mapData(p)); }

  mapData(item: any) {
    const { C0, C1, C2, C3, C4, C5, C6, C7, C8, C9 } = item;
    // Categoria
    const cat = new CategoriaProductoSumary(C4);
    cat.key = C3;
    // Producto
    const producto = new Producto(C1, cat);
    producto.key = C0;
    producto.categoriaProductoID = C3;
    // Tipo Movimiento
    const tipoMovimiento: TipoMovimientoInventario = {
      key: C6,
      nombre: C7,
    };
    // Movimiento
    const mi: MovimientoInventario = {
      producto,
      tipoMovimiento,
      cantidad: C5,
      fecha: moment(C9).toDate(),
    };
    return mi;
  }

  getMovimientos(sucursalID: number, fechaInicio: Date, fechaFin: Date) {
    const params = this.osBD.createParameter('INV0002', 1, {
        'V4': sucursalID,
        'V6': fechaInicio.toJSON(),
        'V7': fechaFin.toJSON()
    });
    return this.osBD.getData(params).pipe(
      map(({ Table }) => this.mapList(Table)));
  }

  getTipoMovimientos(): Observable<TipoMovimientoInventario[]> {
    return this.osBD.getAllDataFromCatalog(this.catalogoTipoMovimientoInventario).pipe(
      map(res => res.map(({ C0, C1 }) => ({
        key: C0,
        nombre: C1,
      }))),
    );
  }
}
