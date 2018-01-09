import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericServiceBase, GenericService } from 'app/modules/generic-catalogs/services/generic.service';
import { MovimientoCaja, CorteCaja, DetalleCorteCaja } from 'app/modules/venta/models/caja.models';
import { MetodoPago } from 'app/modules/venta/models/venta.models';

@Injectable()
export class CajaService extends GenericService<CorteCaja> implements GenericServiceBase<CorteCaja>  {
  constructor(_osBD: BaseAjaxService) {
    super(_osBD);
  }

  mapDataMovimientos(item: any) {
    let mc = new MovimientoCaja();
    mc.ordenVentaID = item.C0;
    mc.nombreCliente = item.R1;
    mc.fecha = moment(item.C1).toDate();;
    mc.monto = item.C2;
    mc.corteID = item.C3;
    mc.esPagoInicial = item.C10;
    mc.totalVenta = item.R2;
    mc.nombreUsuario = item.R5;
    return mc;
  }

  map2Server(item: CorteCaja){
    //'C0,C1,C2'
    let result = ['C0,C1,C2'];
    result = result.concat(
      item.detalle.map(d=> `${d.metodoPagoID},${d.montoEsperado},${d.montoRecibido ? d.montoRecibido : 0}`));
    return result.join('&');
  }

  mapDataDetalle(item: any){
    let dcc = new DetalleCorteCaja(item.C0, item.C2);
    dcc.metodoPago = new MetodoPago(item.C1);
    dcc.metodoPago.key = dcc.metodoPagoID;
    return dcc;
  }

  getMovimientosSinCorte(sucursalID: number){
    let params = this.db.createParameter('ECOM0003', 4, { V4: sucursalID});
    return this.db.getData(params)
      .map(result => result.Table.map(row=> this.mapDataMovimientos(row)));
  }

  getSummaryCortePendiente(sucursalID: number){
    let params = this.db.createParameter('ECOM0003', 5, { V3: sucursalID});
    return this.db.getData(params)
      .map(result=>{
        return result.Table.map(row=> this.mapDataDetalle(row));
      });
  }

  save(_currentValue: CorteCaja, _newValue: CorteCaja) {
    let params = this.db.createParameter('ECOM0002', 3, {
      'V3': _currentValue.usuarioID, 
      'V4': _currentValue.sucursalID, 
      'V5': _currentValue.diferencia,
      'V6': this.map2Server(_currentValue)
    });
    return this.db.getData(params);
  }
}
