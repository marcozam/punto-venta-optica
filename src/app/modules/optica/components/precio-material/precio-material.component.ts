import { Component, OnInit, Input } from '@angular/core';
import { TipoMica, MaterialMica, TratamientoMica } from './../../models/examen.models';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { MaterialMicasService } from './../../services/material-micas.service';
import { TipoMicasService } from './../../services/tipo-micas.service';
import { TratamientoMicasService } from '../../services/tratamiento-micas.service';
import { FormGroup, FormControl } from '@angular/forms';

class PreciosForm {
  formGroup: FormGroup;
  nombre: string;
  key: string;
}

@Component({
  selector: 'app-precio-material',
  templateUrl: './precio-material.component.html',
  styleUrls: ['./precio-material.component.scss'],
  providers: [TipoMicasService, MaterialMicasService, TratamientoMicasService, DialogBoxService]
})
export class PrecioMaterialComponent implements OnInit {
  //Data
  tiposMicas: TipoMica[];
  materialesMicas: MaterialMica[];
  tratamientosMicas: TratamientoMica[];
  fields: PreciosForm[];
  precios: any[];

  @Input()
  listaPreciosID: number;

  constructor(
    private _tipoService: TipoMicasService,
    private _materialService: MaterialMicasService,
    private _tratamientoService: TratamientoMicasService,
    public dialog: DialogBoxService) { 

  }

  createSubscriptions(){
    this._materialService.source$.subscribe(data => this.materialesMicas = data);
    this._tratamientoService.source$.subscribe(data => this.tratamientosMicas = data);
    this._tipoService.source$.subscribe(data => this.tiposMicas = data);
  }

  ngOnInit() {
    this.createSubscriptions();

    this._tipoService.getList();
    this._tratamientoService.getList();
    this._materialService.getList();
  }

  onSave(value){
    let _precios = {};
    this.fields.forEach( row => {
      if(row.formGroup.value.precioBase){
        if(row.formGroup.value.precioBase >= 0) _precios[row.key] = row.formGroup.value;
      }
    })
    //this._tipoServiceFB.setPrecioMicas(this.listaPreciosID, value.material, _precios);
    this.dialog.openDialog('Registro exitoso!', 'Los precios para los Materiales se guardaron correctamente.', false);
  }

  onMaterialChange(material: MaterialMica) {
    /*
    this._tipoServiceFB.getAllMicasPrecios(this.listaPreciosID, material.keyFB, (actualPrice:any[]) => {
        this.precios = actualPrice;
        this.createFormGroups();
      });
      */
  }

  createFormGroups(){
    let _controls: PreciosForm[] = [];
    this.tiposMicas.forEach(tipo => _controls.push(this.createGroup(tipo)));
    this.fields = _controls;
  }

  createGroup(tipo: TipoMica): PreciosForm {
    let _item = { precioBase: new FormControl() };
    this.tratamientosMicas.forEach( tr => _item[tr.keyFB] = new FormControl());

    let _fGroup = new FormGroup(_item);
    let _precio = this.precios.filter(p=> p.key === tipo.keyFB)[0];
    if(_precio) _fGroup.patchValue(_precio);

    return { 
      formGroup: _fGroup,
      nombre: tipo.nombre,
      key: tipo.key.toString()
    }
  }


  getInitialValue(tKey, mKey){
    if(this.precios){
      if(this.precios[tKey]) return this.precios[tKey][mKey];
    }
    return '';
  }
}
