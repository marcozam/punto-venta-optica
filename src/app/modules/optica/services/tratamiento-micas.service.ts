import { Injectable } from '@angular/core';

import { TratamientoMica } from '../models/examen.models';

import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class TratamientoMicasService extends GenericService<TratamientoMica> implements GenericServiceBase<TratamientoMica> {
  catalogID = 1104;
  constructor(_db: BaseAjaxService) {  super(_db, 'os_optica_tratamiento_mica', 480); }
  newInstance() { return new TratamientoMica(); }
}
