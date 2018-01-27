import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { TratamientoMica, TratamientoMicaPrecios } from '../models/examen.models'
import { FieldProperty } from 'app/modules/generic-catalogs/models/generic-catalogs.models';

import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class TratamientoMicasService extends GenericService<TratamientoMica> implements GenericServiceBase<TratamientoMica> {
  catalogID = 1104;
  constructor(_db: BaseAjaxService) {  super(_db, 'os_optica_tratamiento_mica', 480); }
  newInstance(){ return new TratamientoMica(); }

  getByFBKey(key: string){
    let fmd: FieldProperty = TratamientoMica.prototype['keyFB__dbData'];
    return this.db.getAllDataFromCatalog(this.catalogID, `${fmd.key},${key}`)
      .map(result => result.map(it => this.mapData(it)));
  }
}

@Injectable()
export class FBTratamientoMicasService extends FBGenericService<TratamientoMica> {
  constructor(_db: AngularFireDatabase) { 
    super(_db)
    super.setListRefURL('micas/tratamientos');
  }
}