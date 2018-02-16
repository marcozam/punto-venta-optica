import { Injectable } from '@angular/core';
import { StoreProcedureMetaData, StoreProcedureOptionMetaData } from 'app/modules/development/models/store-procedure.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

@Injectable()
export class StoreProceduresService extends GenericService<StoreProcedureMetaData> implements GenericServiceBase<StoreProcedureMetaData> {

  private optionsCatalogID = 298;
  private optionFilterID = 29801;

  constructor(_db: BaseAjaxService) {
    super(_db, 'os_storeprocedures_metadata', 10);
    this.catalogID = 299;
  }

  newInstance() { return new StoreProcedureMetaData(); }

  mapOptionsData(object: any) { return this.mapGenericData(new StoreProcedureOptionMetaData(), object); }

  getOptionsList(storeProcedureID: number) {
    return this.db.getAllDataFromCatalog(this.optionsCatalogID, `${this.optionFilterID},${storeProcedureID}`)
      .map(result => result.map(it => this.mapOptionsData(it)));
  }
}
