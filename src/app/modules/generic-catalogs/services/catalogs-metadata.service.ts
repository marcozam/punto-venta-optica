import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { MetaDataCatalog, MetaDataField, MetaDataTable, MetaDataColumn } from '../models/metadata-catalogs.models';

import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericServiceBase, GenericService } from './generic.service';

@Injectable()
export class CatalogsMetadataService extends GenericService<MetaDataCatalog> implements GenericServiceBase<MetaDataCatalog> {

  private fieldsCatalogID: number = 104;
  private fieldFilterID: number = 10404;

  constructor(_osBD: BaseAjaxService) {
      super(_osBD);
      this.catalogID = 100;
  }

  save(_currentValue: MetaDataCatalog, _newValue: MetaDataCatalog, callback){
    if(_currentValue.hasChanges(_newValue)){
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
        V8: _newValue.tableName ? _newValue.tableName : '',
        V21: _table.join('&')
      };
      let params = this.db.createParameter('DYN0000', 4, d2s);
      this.db.getData(params).subscribe(callback);
    }
    else{
      callback(_currentValue);
    }
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

  getFieldsList(catalogID: number){
    return this.db.getAllDataFromCatalog(this.fieldsCatalogID, `${this.fieldFilterID},${catalogID}`)
      .map(result => result.map(it => this.mapFieldsData(it)));
  }

  getDBTables(){
    return this.db.getData(this.db.createParameter('DYN0003', 1))
      .map(result => result.Table.map(it => this.mapTablesData(it)));
  }

  getDBColumns(tableName: string){
    return this.db.getData(this.db.createParameter('DYN0003', 2, { V3: tableName}))
      .map(result => result.Table.map(it => this.mapColumnData(it)));
  }

  getFieldTypes(){
    return this.db.getData(this.db.createParameter('DYN0000', 1))
      .map(result => result.Table.map(it => this.db.mapGeneric(it)));
  }
}

const categoriaProucto = new MetaDataCatalog();
categoriaProucto.key = '100';
categoriaProucto.nombre = 'Categoria de Productos';
categoriaProucto.referenceURL = 'productos/categorias';
categoriaProucto.detailURL = '/producto/categoria/';

const categoriaArmazon = new MetaDataCatalog();
categoriaArmazon.key = '999';
categoriaArmazon.nombre = 'Categorias de Armazones';
categoriaArmazon.referenceURL = 'armazones/categorias';

const marcaProducto = new MetaDataCatalog();
marcaProducto.key = '998';
marcaProducto.nombre = 'Marca Productos';
marcaProducto.referenceURL = 'armazones/marcas';
marcaProducto.detailURL = '/armazon/marca/'

const modeloArmazon = new MetaDataCatalog();
modeloArmazon.key = '997';
modeloArmazon.nombre = 'Modelo Armazones';
modeloArmazon.referenceURL = 'armazones/modelos';
modeloArmazon.detailURL = '/armazon/modelo/';

const tipoMicas = new MetaDataCatalog();
tipoMicas.key = '996';
tipoMicas.nombre = 'Tipo de Micas';
tipoMicas.referenceURL = 'micas/tipos';
tipoMicas.detailURL = '/mica/tipo/';

const materialMicas = new MetaDataCatalog();
materialMicas.key = '995';
materialMicas.nombre = 'Material de Micas';
materialMicas.referenceURL = 'micas/materiales';

const tratamientoMicas = new MetaDataCatalog();
tratamientoMicas.key = '994';
tratamientoMicas.nombre = 'Tratamiento de Micas';
tratamientoMicas.referenceURL = 'micas/tratamientos';

export const _catalogs: MetaDataCatalog[] = [
  categoriaProucto,
  categoriaArmazon,
  marcaProducto,
  modeloArmazon,
  tipoMicas,
  materialMicas,
  tratamientoMicas
];