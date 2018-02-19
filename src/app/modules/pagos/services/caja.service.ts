import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericServiceBase, GenericService } from 'app/modules/generic-catalogs/services/generic.service';
import { MovimientoCaja, CorteCaja, DetalleCorteCaja } from '../models/caja.models';
import { MetodoPago } from 'app/modules/venta/models/venta.models';

@Injectable()
export class CajaService extends GenericService<CorteCaja> implements GenericServiceBase<CorteCaja>  {

  constructor(_osBD: BaseAjaxService) {
    super(_osBD);
    this.autoSort = false;
  }

  newInstance() { return new CorteCaja(0, 0); }

  mapData(item: any) {
    const c = new CorteCaja(item.C2, item.C1);
    c.key = item.C0;
    c.usuario.nombre = item.R1;
    c.sucursal.nombre = item.R2;
    c.fechaCorte = item.C3;
    c.totalEsperado = item.C4;
    c.totalRecibido = 0;
    return c;
  }

  mapDataMovimientos(item: any) {
    const mc = new MovimientoCaja();
    mc.key = item.C4;
    mc.ordenVentaID = item.C0;
    mc.nombreCliente = item.R1;
    mc.fecha = moment(item.C1).toDate();
    mc.monto = item.C2;
    mc.corteID = item.C3;
    mc.esPagoInicial = item.C10;
    mc.totalVenta = item.R2;
    mc.nombreUsuario = item.R5;
    const mp = new MetodoPago(item.R3);
    mp.key = item.C5;
    mc.metodoPago = mp;
    return mc;
  }

  mapDataDetalle(item: any) {
    const dcc = new DetalleCorteCaja(item.C0, item.C2);
    dcc.metodoPago = new MetodoPago(item.C1);
    dcc.metodoPago.key = dcc.metodoPagoID;
    dcc.montoRecibido = item.C3 ? item.C3 : 0;
    return dcc;
  }

  map2Server(item: CorteCaja) {
    // 'C0,C1,C2'
    let result = ['C0,C1,C2'];
    result = result.concat(
      item.detalle.map(d => `${d.metodoPagoID},${d.montoEsperado},${d.montoRecibido ? d.montoRecibido : 0}`));
    return result.join('&');
  }

  getMovimientosCorte(sucursalID: number, corteID: number) {
    const params = this.db.createParameter('ECOM0006', 4, { V4: sucursalID, V5: corteID});
    return this.db.getData(params).map(result => result.Table.map(row => this.mapDataMovimientos(row)));
  }

  deleteMovimientoCaja(item: MovimientoCaja) {
    let params: any;
    if (item.esPagoInicial) {
      console.log('Cancelar Venta');
    } else {
      params = this.db.createParameter('ECOM0006', 2, { V3: item.key });
      return this.db.getData(params);
    }
  }

  getCortes(sucursalID: number) {
    const params = this.db.createParameter('ECOM0006', 1, { V4: sucursalID});
    return this.db.getData(params).map(result => this.mapList(result.Table));
  }

  getDetalleCorte(corteID: number) {
    const params = this.db.createParameter('ECOM0006', 5, { V5: corteID});
    return this.db.getData(params).map(result => result.Table.map(row => this.mapDataDetalle(row)));
  }

  getSummaryCortePendiente(sucursalID: number) {
    const params = this.db.createParameter('ECOM0003', 5, { V3: sucursalID});
    return this.db.getData(params).map(result => result.Table.map(row => this.mapDataDetalle(row)));
  }

  save(_currentValue: CorteCaja, _newValue: CorteCaja) {
    const params = this.db.createParameter('ECOM0006', 3, {
      'V3': _currentValue.usuarioID,
      'V4': _currentValue.sucursalID,
      'V5': _currentValue.diferencia,
      'V6': this.map2Server(_currentValue)
    });
    return this.db.getData(params)
      .map(value => {
        const corte = this.mapData(value.Table[0]);
        corte.detalle = _currentValue.detalle;
        return corte;
      });
  }
}
