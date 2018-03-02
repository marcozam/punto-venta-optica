import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
// Models
import { TipoMica, MaterialMica, TratamientoMica, MicaPrecio } from '../../models/examen.models';
// Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { TipoMicasService } from '../../services/tipo-micas.service';
import { MaterialMicasService } from '../../services/material-micas.service';
import { TratamientoMicasService } from '../../services/tratamiento-micas.service';
// Constants
import { SuccessTitle } from '../../../base/constants/messages.contants';

class PreciosForm {
  formGroup: FormGroup;
  nombre: string;
  key: number;
}

@Component({
  selector: 'app-precio-material',
  templateUrl: './precio-material.component.html',
  styleUrls: ['./precio-material.component.scss'],
  providers: [TipoMicasService, MaterialMicasService, TratamientoMicasService, DialogBoxService]
})
export class PrecioMaterialComponent implements OnInit {
  // Data
  private _selectedMaterial: MaterialMica;
  tiposMicas: TipoMica[];
  materialesMicas: MaterialMica[];
  tratamientosMicas: TratamientoMica[];
  fields: PreciosForm[];
  precios: MicaPrecio[];

  @Input() listaPreciosID: number;

  constructor(
    private _tipoService: TipoMicasService,
    private _materialService: MaterialMicasService,
    private _tratamientoService: TratamientoMicasService,
    public dialog: DialogBoxService) { }

  createSubscriptions() {
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

  onSave() {
    this._materialService.setPrecios(
      this.listaPreciosID,
      this._selectedMaterial.key,
      this.tratamientosMicas,
      this.fields.map( row => ({key: row.key, value: row.formGroup.value}))
    ).subscribe(() => {
      this.dialog.openDialog(SuccessTitle, 'Los precios para los Materiales se guardaron correctamente.', false);
    });
  }

  onMaterialChange(material: MaterialMica) {
    this._materialService.getPrecio(this.listaPreciosID, material.key).subscribe(result => {
      this._selectedMaterial = material;
      this.precios = result;
      this.createFormGroups();
    });
  }

  createFormGroups() {
    let _controls: PreciosForm[] = [];
    _controls = this.tiposMicas.map(tipo => this.createGroup(tipo));
    this.fields = _controls;
  }

  createGroup(tipo: TipoMica): PreciosForm {
    const _item = { precioBase: new FormControl() };
    this.tratamientosMicas.forEach( tr => _item['tratamiento_' + tr.key] = new FormControl());

    // Sets initial values
    const _precio = this.precios.find(p => p.tipoMicaID === tipo.key);
    if (_precio) {
      _item.precioBase.patchValue(_precio.precioBase);
      _precio.tratamientos.forEach(tr => {
        _item['tratamiento_' + tr.tratamientoID].patchValue(tr.precio);
      });
    }

    return {
      formGroup: new FormGroup(_item),
      nombre: tipo.nombre,
      key: tipo.key
    };
  }


  getInitialValue(tKey, mKey) {
    if (this.precios) { if (this.precios[tKey]) { return this.precios[tKey][mKey]; }}
    return '';
  }
}
