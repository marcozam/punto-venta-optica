import { Injectable } from '@angular/core';

import { MetaDataCatalog, MetaDataField, MetaDataTable, MetaDataColumn } from '../models/metadata-catalogs.models';

import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericServiceBase, GenericService } from './generic.service';

@Injectable()
export class CatalogsMetadataService extends GenericService<MetaDataCatalog> implements GenericServiceBase<MetaDataCatalog> {

  private fieldsCatalogID = 104;
  private fieldFilterID = 10404;

  constructor(_osBD: BaseAjaxService) {
      super(_osBD);
      this.catalogID = 100;
  }

  save(_currentValue: MetaDataCatalog, _newValue: MetaDataCatalog) {
    // TODO: Mising check for changes
    let idx = 0;
    const _table = [];
    _table.push('C0,C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11');
    _currentValue.fields.forEach(it => {
      const row = [];
      row.push( it.isNew ? 0 : it.key, it.nombre, it.nombreCorto, it.tipoCampoID, 0, '', it.required, idx++, it.visible, it.fieldName, 0, 0);
      _table.push(row.join(','));
    });

    const d2s = {
      V4: _currentValue.key,
      V5: _newValue.nombre,
      V6: _newValue.detailURL,
      V7: _newValue.dynamic ? '1' : '0',
      V8: _newValue.tableName ? _newValue.tableName : '',
      V9: _newValue.listURL,
      V21: _table.join('&')
    };
    const params = this.db.createParameter('DYN0000', 4, d2s);
    return this.db.getData(params);
  }

  newInstance() { return new MetaDataCatalog(); }

  mapFieldsData(r) {
    const item = this.mapGenericData(new MetaDataField(), r);
    item.isNew = false;
    return item;
  }

  mapTablesData(r) { return this.mapGenericData(new MetaDataTable(), r); }

  mapColumnData(r) {
    const item = this.mapGenericData(new MetaDataColumn(), r);
    item.isNullable = r.C4 === 'NO' ? false : true;
    return item;
  }

  getFieldsList(catalogID: number) {
    return this.db.getAllDataFromCatalog(this.fieldsCatalogID, `${this.fieldFilterID},${catalogID}`)
      .map(result => result.map(it => this.mapFieldsData(it)));
  }

  getDBTables() {
    return this.db.getData(this.db.createParameter('DYN0003', 1))
      .map(result => result.Table.map(it => this.mapTablesData(it)));
  }

  getDBColumns(tableName: string) {
    return this.db.getData(this.db.createParameter('DYN0003', 2, { V3: tableName}))
      .map(result => result.Table.map(it => this.mapColumnData(it)));
  }

  getFieldTypes() {
    return this.db.getData(this.db.createParameter('DYN0000', 1))
      .map(result => result.Table.map(it => this.db.mapGeneric(it)));
  }
}
