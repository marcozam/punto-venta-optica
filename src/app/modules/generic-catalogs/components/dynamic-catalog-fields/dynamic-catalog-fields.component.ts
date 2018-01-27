import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MetaDataField, MetaDataCatalog } from '../../models/metadata-catalogs.models'
import { GenericCatalog } from 'app/modules/base/models/base.models';

import { FormControl, FormGroup } from '@angular/forms'

class FieldForms{
  value: MetaDataField;
  formGroup: FormGroup;
}

@Component({
  selector: 'app-dynamic-catalog-fields',
  templateUrl: './dynamic-catalog-fields.component.html',
  styleUrls: ['./dynamic-catalog-fields.component.scss']
})
export class DynamicCatalogFieldsComponent implements OnInit {

  private _catalogo: MetaDataCatalog;

  workingFields: FieldForms[];

  @Output()
  onRequestSave: EventEmitter<any> = new EventEmitter();

  @Input()
  //Add setter
  set catalog(value: MetaDataCatalog){
    this._catalogo = value;
    this.createFormGroups();
  }
  get catalog(): MetaDataCatalog{
    return this._catalogo;
  }

  @Input()
  fieldTypes: GenericCatalog[];

  constructor() { }

  ngOnInit() {
  }

  createFormGroups(){
    let _controls: FieldForms[] = [];
    this._catalogo.fields.forEach(fld => {
      _controls.push(this.createGroup(fld));
    });
    this.workingFields = _controls;
  }

  createGroup(fld: MetaDataField){
    return {
      value: fld,
      formGroup:
        new FormGroup({
          nombre: new FormControl(fld.nombre),
          nombreCorto: new FormControl(fld.nombreCorto),
          fieldName: new FormControl(fld.fieldName),
          tipoCampoID: new FormControl(fld.tipoCampoID)
        })
    }
  }

  addNewField(){
    let _fld =  new MetaDataField();
    _fld.key = new Date().getTime();
    this.workingFields.push(this.createGroup(_fld));
  }

  onDeleteField(field: FieldForms){
    if(field.value.isNew){
      //eliminar sin problemas
    }
    else{
      //lanzar warning
    }
  }

  onSave(){
    let _fields: MetaDataField[] = [];
    //double check 
    let allValid: boolean = true;
    this.workingFields.forEach( fld =>{
      if(fld.formGroup.invalid){
        allValid = false;
      }
      let _fld: MetaDataField = Object.assign(fld.value, fld.formGroup.value);
      _fld.key = _fld.isNew ? 0 : _fld.key;
      _fields.push(_fld);
    })
    if(allValid){
      this.onRequestSave.emit(_fields);
    }
  }
}