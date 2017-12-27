import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { MetaDataCatalog, MetaDataField, MetaDataTable, MetaDataColumn } from '../models/metadata-catalogs.models';

import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericServiceBase } from './generic.service';

@Injectable()
export class CatalogsMetadataService implements GenericServiceBase<MetaDataCatalog> {
  private catalogID: number = 100;
  private fieldsCatalogID: number = 104;
  private fieldFilterID: number = 10404;

  constructor(private _osBD: BaseAjaxService) {
      
  }

  hasChanges(v1: MetaDataCatalog, v2: MetaDataCatalog){
    return v1.nombre !== v2.nombre || 
      v1.filterAccount !== v2.filterAccount ||
      v1.tableName !== v2.tableName ||
      v1.dynamic !== v2.dynamic ||
      v1.fields.length !== v2.fields.length;
  }

  save(_currentValue: MetaDataCatalog, _newValue: MetaDataCatalog, callback){
    if(this.hasChanges(_currentValue, _newValue)){
      let idx: number = 0;
      let _table = [];
      _table.push('C0,C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11');
      _currentValue.fields.forEach(it =>{
        let row = [];
        row.push( it.isNew ? 0 : it.key, it.nombre, it.nombreCorto, it.tipoCampoID, 0, '', it.required, idx++, it.visible, it.fieldName, 0, 0);
        _table.push(row.join(','));
      });

      let d2s = {
        V4: _currentValue.key,  
        V5: _newValue.nombre, 
        // Name Tamplate => Deprecated
        V6: '', 
        V7: _newValue.dynamic ? '1' : '0',
        V8: _newValue.tableName,
        V21: _table.join('&')
      };
      console.log(d2s.V21);
      let params = this._osBD.createParameter('DYN0000', 4, d2s);
      this._osBD.getData(params).subscribe(callback);
    }
    else{
      callback(_currentValue);
    }
  }

  mapList(r: any[]) {
    r.map(it=>{
      return this.mapData(it);
    })
  }

  mapData(r){
    let item = new MetaDataCatalog();
    item.key = r.C0;
    item.nombre = r.C1;
    //C2 => Name Tamplate => Deprecated
    item.dynamic = r.C3;
    item.tableName = r.C4;
    item.filterAccount = r.C5;
    return item;
  }

  mapFieldsData(r){
    let item = new MetaDataField();
    item.key = r.C0;
    item.nombre = r.C1;
    item.nombreCorto = r.C2;
    item.tipoCampoID = r.C3;
    item.catalogoReferenciaID = r.C4;
    item.displayMember = r.C5;
    item.required = r.C6;
    item.orden = r.C7;
    item.visible = r.C8;
    item.fieldName = r.C9;
    item.catalogoID = r.C13;
    item.isNew = false;
    return item;
  }

  mapTablesData(r){
    let item = new MetaDataTable();
    item.name = r.C1;
    item.scheme = r.C2;
    return item;
  }

  mapColumnData(r){
    let item = new MetaDataColumn();
    item.name = r.C1;
    item.dbType = r.C2;
    item.maxLength = r.C3;
    item.isNullable = r.C4 === 'NO' ? false : true;
    item.position = r.C5;
    item.tipoDatoID = r.R2;
    item.tipoCampoID = r.R1;
    return item;
  }

  getCatalogByID(catalogID: number, callback){
    this._osBD.getDetailedData(this.catalogID, catalogID)
      .subscribe(r => callback(this.mapData(r)));
  }

  getCatalogList(callback){
    this._osBD.getAllDataFromCatalog(this.catalogID)
      .subscribe((r:any[])=> callback(r.map(it => this.mapData(it))));
  }

  getCatalogData(catalogID: number, callback){
    this._osBD.getAllDataFromCatalog(catalogID)
      .subscribe(callback);
  }

  getFieldsList(catalogID: number, callback){
    this._osBD.getAllDataFromCatalog(this.fieldsCatalogID, `${this.fieldFilterID},${catalogID}`)
      .subscribe((r:any[])=> callback(r.map(it => this.mapFieldsData(it))));
  }

  getDBTables(callback){
    this._osBD.getData(this._osBD.createParameter('DYN0003', 1))
      .subscribe(r => callback(r.map(it => this.mapTablesData(it))));
  }

  getDBColumns(tableName: string, callback){
    this._osBD.getData(this._osBD.createParameter('DYN0003', 2, { V3: tableName}))
      .subscribe(r => callback(r.map(it => this.mapColumnData(it))));
  }

  getFieldTypes(callback){
    this._osBD.getData(this._osBD.createParameter('DYN0000', 1))
      .subscribe(r => callback(r.map(it => this._osBD.mapGeneric(it))));
  }
}



export const _catalogs: MetaDataCatalog[] = [
    {
      key: '100',
      nombre: 'Categoria de Productos',
      referenceURL : 'productos/categorias',
      createdDate: 1,
      detailURL: '/producto/categoria/'
    },
    {
      key: '999',
      nombre: 'Categorias de Armazones',
      referenceURL : 'armazones/categorias',
      createdDate: 1,
    },
    {
      key: '998',
      nombre: 'Marca Productos',
      referenceURL : 'armazones/marcas',
      createdDate: 1,
      detailURL: '/armazon/marca/'
    },
    {
      key: '997',
      nombre: 'Modelo Armazones',
      referenceURL : 'armazones/modelos',
      createdDate: 1,
      detailURL: '/armazon/modelo/'
    },
    {
      key: '996',
      nombre: 'Tipo de Micas',
      referenceURL : 'micas/tipos',
      createdDate: 1,
      detailURL: '/mica/tipo/'
    },
    {
      key: '995',
      nombre: 'Material de Micas',
      referenceURL : 'micas/materiales',
      createdDate: 1,
    },
    {
      key: '994',
      nombre: 'Tratamiento de Micas',
      referenceURL : 'micas/tratamientos',
      createdDate: 1,
    }
  ];