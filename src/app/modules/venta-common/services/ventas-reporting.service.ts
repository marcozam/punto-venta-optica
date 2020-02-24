import { Injectable } from '@angular/core';
import * as moment from 'moment';
// RxJs
import { map } from 'rxjs/operators';
// Models
import { Status } from 'app/modules/base/models/base.models';
import { MetodoPago, Venta, DetalleVenta } from 'app/modules/venta/models/venta.models';
import { ResumenVenta, Ingresos } from '../models/ventas-reporting.models';
import { Producto } from 'app/modules/producto/models/producto.models';
// Services
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class VentasReportingService {
  constructor(private db: BaseAjaxService) { }

  mapList(list: any[]): Venta[] { return list.map(p => this.mapData(p)); }

  mapData(item: any): Venta {
    const { C0, C1, C2, C3, C4, C5, R1, R2, R3, R4, R5 } = item;
    const venta = new Venta({ key: R3, nombre: R2 }, { key: C5, nombre: R5 });
    venta.sumary.fecha = moment(C1).toDate();
    venta.sumary.subTotal = C2;
    venta.sumary.impuestos = 0;
    venta.sumary.totalPagado = C3;
    venta.sumary.status = new Status();
    venta.sumary.statusInterno = new Status();
    // STATUS INTERNO
    // venta.sumary.statusInterno.key = item.R3;
    // venta.sumary.statusInterno.nombre = item.R2;
    // STATUS
    // venta.sumary.status.key = item.R7;
    // venta.sumary.status.nombre = item.R6;
    // VENDEDOR
    venta.sumary.vendedor.key = C5;
    venta.sumary.vendedor.nombre = R5;
    // CLIENTE
    venta.sumary.cliente.key = C4;
    venta.sumary.cliente.persona.nombre = R1;
    return venta;
  }

  mapDetalleVentaData(item: any): DetalleVenta {
      const dv = new DetalleVenta(new Producto(item.C2));
      dv.productoVenta.key =  item.C0;
      dv.cantidad = item.C1;
      dv.precioUnitario = item.C3;
      dv.comentario = item.C10;
      return dv;
  }

  getOrdenesPendientesEntrega(sucursalID: number, clienteID: number) {
      const params = this.db.createParameter('ECOM0003', 3, {
          V4: sucursalID ? sucursalID : '',
          V8: clienteID ? clienteID : '',
      });
      return this.db.getData(params).pipe(
        map(result => this.mapList(result.Table))
      );
  }

  getHistorialCompras(clienteID: number) {
      const params = this.db.createParameter('ECOM0003', 4, { V3: clienteID ? clienteID : '' });
      return this.db.getData(params).pipe(
        map(result => this.mapList(result.Table))
      );
  }

  getProductosVendidos(month: number, year: number, sucursalID: number) {
      const params = this.db.createParameter('ECOM0003', 8, { V4: sucursalID, V5: year, V6: month });
      return this.db.getData(params).pipe(
        map(data => {
          return data.Table.map(row => {
              return {
                  categoria: row.C1,
                  modelo: row.C3,
                  marca: row.C4,
                  cantidad: row.C6
              };
          });
      })
    );
  }

  getResumenMensual(month: number, year: number, sucursalID: number) {
      const params = this.db.createParameter('ECOM0003', 1, { V4: sucursalID, V5: year, V6: month });
      return this.db.getData(params).pipe(
        map(data => {
          const resumen = new ResumenVenta();
          const _dResume = data.Table[0];
          resumen.totalVenta = _dResume.C1;
          resumen.totalPagado = _dResume.C2;
          resumen.noVentas = _dResume.C3;
          resumen.ingresos = data.Table1.map(ing => {
              const mp = new MetodoPago(ing.C1);
              mp.key = ing.C1;
              return new Ingresos(mp, ing.C2);
          });
          resumen.lista = this.mapList(data.Table2);
          return resumen;
      })
    );
  }

  // Exclusivo Optika
  getResumenMensualOptika(month: number, year: number, sucursalID: number) {
    const params = this.db.createParameter('OPTICA_0001', 10, { V4: sucursalID, V5: year, V6: month });
    return this.db.getData(params).pipe(
      map(data => {
        return {
          oftalmologos: data.Table.map( row => ({nombre: row.C1, noExamenes: row.C2})),
          armazones: data.Table1.map( row => ({armazon: row.C1, noVentas: row.C2}))
        };
      })
    );
  }
}
