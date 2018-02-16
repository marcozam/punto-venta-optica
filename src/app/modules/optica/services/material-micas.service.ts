import { Injectable } from '@angular/core';

import { MaterialMica } from '../models/examen.models';
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { FieldProperty } from 'app/modules/generic-catalogs/models/generic-catalogs.models';

@Injectable()
export class MaterialMicasService extends GenericService<MaterialMica> implements GenericServiceBase<MaterialMica> {

  catalogID = 1103;

  constructor(_db: BaseAjaxService) {
    super(_db, 'os_optica_material_mica', 480);
  }

  newInstance() { return new MaterialMica(); }

  getByFBKey(key: string) {
    const fmd: FieldProperty = MaterialMica.prototype['keyFB__dbData'];
    return this.db.getAllDataFromCatalog(this.catalogID, `${fmd.key},${key}`)
      .map(result => result.map(it => this.mapData(it)));
  }
}
