import { Injectable } from '@angular/core';
import { getFields } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';

import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

import { Persona } from 'app/modules/base/models/base.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { Sucursal } from 'app/modules/generic-catalogs/models/generic-catalogs.models';

@Injectable()
export class SucursalService extends GenericService<Sucursal> implements GenericServiceBase<Sucursal> {

    constructor(_db: BaseAjaxService) {
      super(_db);
      this.catalogID = 1;
    }

    newInstance() { return new Sucursal(); }
}
