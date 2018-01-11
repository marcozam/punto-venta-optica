import { Injectable } from '@angular/core';
import { StoreProcedureMetaData, StoreProcedureOptionMetaData } from 'app/modules/development/models/store-procedure.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

@Injectable()
export class StoreProceduresService extends GenericService<StoreProcedureMetaData> implements GenericServiceBase<StoreProcedureMetaData> {
  
  private optionsCatalogID: number = 298;
  private optionFilterID: number = 29801;
  
  constructor(private _db: BaseAjaxService) { 
    super(_db, 'os_storeprocedures_metadata', 10);
    this.catalogID = 299;
  }

  save(_currentValue: StoreProcedureMetaData, _newValue: StoreProcedureMetaData, callback?: any) {
    throw new Error("Method not implemented.");
  }
  
  newInstance(){
    return new StoreProcedureMetaData();
  }

  mapData(object: any, instantiate?: boolean): StoreProcedureMetaData {
    let item = new StoreProcedureMetaData();
    if(object){
      item.key = object.C0;
      item.nombre = object.C1;
      item.description = object.C2;
    }
    return object || instantiate ? item : null;
  }

  mapOptionsData(object: any){
    let item = new StoreProcedureOptionMetaData();
    item.key = object.C0;
    item.storeProcedureID = object.C1;
    item.opcion = object.C2;
    item.description = object.C3;
    item.allowAll = object.C4;
    return item;
  }

  getOptionsList(storeProcedureID: number){
    return this.db.getAllDataFromCatalog(this.optionsCatalogID, `${this.optionFilterID},${storeProcedureID}`)
      .map(result => result.map(it => this.mapOptionsData(it)));
  }
}
