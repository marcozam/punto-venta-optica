import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { MovimientoCaja } from 'app/modules/venta/models/caja.models';

@Injectable()
export class CajaService {
  constructor(private _osBD: BaseAjaxService) {
    
  }

  mapList(list: any[]){
    return list.map(p=>{
        return this.mapData(p);
    })
  }

  mapData(item: any) { 
    let mc = new MovimientoCaja();
    mc.ordenVentaID = item.C0;
    mc.nombreCliente = item.R1;
    mc.fecha = moment(item.C1).toDate();;
    mc.monto = item.C2;
    mc.corteID = item.C3;
    mc.esPagoInicial = item.C10;
    mc.nombreUsuario = item.R5;
    return mc;
  }

  getMovimientosSinCorte(sucursalID: number, callback){
    let params = this._osBD.createParameter('ECOM0003', 4, { V4: sucursalID});
    this._osBD.getData(params)
      .subscribe(res => { 
        callback(this.mapList(res.Table));
      });
  }

  /*
  SUMMARY
  let params = this._osBD.createParameter('ECOM0003', 5, { V3: sucursalID});
    this._osBD.getData(params, callback);
  */
}
