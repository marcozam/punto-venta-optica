import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MaterialMica, MicaPrecio, TratamientoMicaPrecios, TratamientoMica } from '../models/examen.models';
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class MaterialMicasService extends GenericService<MaterialMica> implements GenericServiceBase<MaterialMica> {

  catalogID = 1103;

  constructor(_db: BaseAjaxService) {
    super(_db, 'os_optica_material_mica', 480);
  }

  newInstance() { return new MaterialMica(); }

  getPrecio(listaPrecioID: number, materialID: number): Observable<MicaPrecio[]> {
    const params = this.db.createParameter('OPTICA_0001', 3, {
        V3: listaPrecioID,
        V5: materialID
    });
    return this.db.getData(params).pipe(map(data => {
      let rValue: MicaPrecio[] = [];
      if (data.Table.length > 0) {
        rValue = data.Table.map(ptm => {
          const precio = new MicaPrecio(ptm.C1, materialID, ptm.C0);
          precio.tratamientos = data.Table1
            .filter(t => t.C0 === precio.tipoMicaID)
            .map(item => new TratamientoMicaPrecios(item.C1, item.C2, item.C3));
          return precio;
        });
      }
      return rValue;
    }));
  }

  setPrecios(listaPrecioID: number, materialID: number, tratamientos: TratamientoMica[], data: {key:  number, value: any}[]) {
    const d2s = [];
    data.forEach( row => {
      const _d2s = [row.key];
      const value = row.value;
      if (value.precioBase) {
        if (value.precioBase >= 0) {
          d2s.push(_d2s.concat([ 1, 0, value.precioBase]).join(','));
          _d2s.push(0);
          tratamientos.forEach(tr => {
            const pTr = value['tratamiento_' + tr.key];
            if (pTr) { if (pTr >= 0) {
                d2s.push(_d2s.concat([ tr.key, value['tratamiento_' + tr.key]]).join(','));
            }}
          });
        }
      }
    });
    const params = this.db.createParameter('OPTICA_0001', 5, {
      V3: listaPrecioID,
      V4: materialID,
      V6: `C0,C1,C2,C3~${d2s.join('~')}`
    });
    return this.db.getData(params);
  }
}
