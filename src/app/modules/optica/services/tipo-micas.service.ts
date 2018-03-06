import { Injectable } from '@angular/core';
// Models
import { TipoMica } from '../models/examen.models';
// Services
import { GenericServiceBase, GenericService } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class TipoMicasService extends GenericService<TipoMica> implements GenericServiceBase<TipoMica> {

  catalogID = 1102;

  constructor(_db: BaseAjaxService) {
    super(_db, 'os_optica_tipo_mica', 480);
  }

  mapList(list: any[]) {
    const iList = super.mapList(list);
    let respond: TipoMica[] = iList.filter(d => d.tipoMica === 1);
    respond = respond.concat(iList.filter(d => d.tipoMica === 0));
    respond = respond.concat(iList.filter(d => d.tipoMica === 2));
    return respond;
  }

  newInstance() { return new TipoMica(); }
}
