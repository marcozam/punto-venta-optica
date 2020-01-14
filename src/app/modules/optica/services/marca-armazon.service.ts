import { Injectable } from '@angular/core';
import { MarcaArmazon } from '../models/armazon.models';
import { GenericServiceBase, GenericService } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

// This service is not on SQL
@Injectable()
export class MarcaArmazonService extends GenericService<MarcaArmazon> implements GenericServiceBase<MarcaArmazon> {

  constructor(_db: BaseAjaxService) {
    super(_db);
  }

  newInstance() { return new MarcaArmazon(); }
}
