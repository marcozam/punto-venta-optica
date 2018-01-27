import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { MaterialMica } from '../models/examen.models';
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { FieldProperty } from 'app/modules/generic-catalogs/models/generic-catalogs.models';

@Injectable()
export class MaterialMicasService extends GenericService<MaterialMica> implements GenericServiceBase<MaterialMica> {

  catalogID = 1103;

  constructor(_db: BaseAjaxService) { 
    super(_db, 'os_optica_material_mica', 480);
  }

  newInstance(){ return new MaterialMica(); }

  getByFBKey(key: string){
    let fmd: FieldProperty = MaterialMica.prototype['keyFB__dbData'];
    return this.db.getAllDataFromCatalog(this.catalogID, `${fmd.key},${key}`)
      .map(result => result.map(it => this.mapData(it)));
  }
}