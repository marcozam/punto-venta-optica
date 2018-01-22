import { Component, OnInit, Input } from '@angular/core';
import { TipoMica, MaterialMica, TratamientoMica } from './../../models/examen.models';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { MaterialMicasService } from './../../services/material-micas.service';
import { FBTipoMicasService } from './../../services/tipo-micas.service';
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
  providers: [FBTipoMicasService, MaterialMicasService, TratamientoMicasService, DialogBoxService]
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
    private _tipoService: FBTipoMicasService,
    private _materialService: MaterialMicasService,
    private _tratamientoService: TratamientoMicasService,
    public dialog: DialogBoxService) { 

  }

  ngOnInit() {
    this._tipoService.getCatalogList((tipos: TipoMica[]) => {
      //Ordena las micas por monofocal, ambas o bifocal
      tipos.sort((a:TipoMica, b:TipoMica)=>{
        if(a.nombre < b.nombre) return -1;
        if(a.nombre > b.nombre) return 1;
        return 0;
      })
      this.tiposMicas = [].concat(
        tipos.filter(data=> { return data.tipoMica === 1}), 
        tipos.filter(data=> { return data.tipoMica === 0}),
        tipos.filter(data=> { return data.tipoMica === 2})
      );
      this._tratamientoService.getCatalogList((tratamientos: TratamientoMica[]) => {
        this.tratamientosMicas = tratamientos;
        this._materialService.getCatalogList((data: MaterialMica[]) => {
          this.materialesMicas = data;
        });
      });
    });
  }

  onSave(value){
    let _precios = {};
    this.fields.forEach( row => {
      if(row.formGroup.value.precioBase){
        if(row.formGroup.value.precioBase >= 0){
          _precios[row.key] = row.formGroup.value;
        }
      }
    })
    this._tipoService.setPrecioMicas(this.listaPreciosID, value.material, _precios);
    this.dialog.openDialog('Registro exitoso!', 'Los precios para los Materiales se guardaron correctamente.', false);
  }

  onMaterialChange(material: string){
    this._tipoService.getAllMicasPrecios(this.listaPreciosID, material, (actualPrice:any[]) =>{
        this.precios = actualPrice;
        this.createFormGroups();
      });
  }

  createFormGroups(){
    console.log('creating forms....');
    let _controls: PreciosForm[] = [];
    this.tiposMicas.forEach(tipo => {
      _controls.push(this.createGroup(tipo));
    });
    console.log(_controls);
    this.fields = _controls;
  }

  createGroup(tipo: TipoMica): PreciosForm{
    let _item = {
      precioBase: new FormControl()
    };
    this.tratamientosMicas.forEach( tr => {
      _item[tr.key] = new FormControl();
    });
    let _fGroup = new FormGroup(_item);
    let _precio = this.precios.filter(p=> p.key === tipo.key)[0];
    if(_precio)
      _fGroup.patchValue(_precio);
    return { 
      formGroup: _fGroup,
      nombre: tipo.nombre,
      key: tipo.key.toString()
    }
  }


  getInitialValue(tKey, mKey){
    if(this.precios){
      if(this.precios[tKey]){
        return this.precios[tKey][mKey];
      }
    }
    return '';
  }
}
