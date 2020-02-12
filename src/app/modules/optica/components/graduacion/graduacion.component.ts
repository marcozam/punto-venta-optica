import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, merge } from 'rxjs';

// Services
import { MaterialMicasService } from './../../services/material-micas.service';
import { TipoMicasService } from './../../services/tipo-micas.service';
import { ExamenService } from '../../services/examen.service';
// Models
import { Examen, MaterialMica, TipoMica } from '../../models/examen.models';
import { Contacto } from 'app/modules/crm/models/crm.models';

export type GraduacionNextAction = 'venta' | 'presupuesto';

export class GraduacionEventChange {
  constructor(
    public value: Examen,
    public action: GraduacionNextAction) { }
}

@Component({
  selector: 'app-graduacion',
  templateUrl: './graduacion.component.html',
  styleUrls: ['./graduacion.component.scss'],
  providers: [ExamenService, TipoMicasService, MaterialMicasService]
})
export class GraduacionComponent implements OnInit {
  ojoDerechoValid: Boolean;
  ojoIzquierdoValid: Boolean;
  // Data
  tiposMicas: TipoMica[];
  materialesMicas: MaterialMica[];
  ojoDerechoInvalid: Boolean;
  ojoIzquierdoInvalid: Boolean;
  loading$: Observable<boolean>;
  loading = false;

  @Input() editable = true;
  @Input() pacienteID: number;
  @Input() paciente: Contacto;

  private _examen: Examen;
  @Output() examenChange: EventEmitter<Examen> = new EventEmitter();
  @Input()
  get examen(): Examen { return this._examen; }
  set examen(value) {
    this._examen = value;
    this.examenChange.emit(value);
  }

  @Output() materialChange: EventEmitter<any> = new EventEmitter();
  @Output() tipoMicaChange: EventEmitter<any> = new EventEmitter();
  @Output() onSaved: EventEmitter<GraduacionEventChange> = new EventEmitter();

  constructor(
    private _serviceExamen: ExamenService,
    private _tipoService: TipoMicasService,
    private _materialService: MaterialMicasService) {
    this._examen = new Examen();
    // Observer when app is retriving data
    this.loading$ = merge(_serviceExamen.loading$, _tipoService.loading$, _materialService.loading$);
  }

  createSubscriptions() {
    this.loading$.subscribe(() => {
      this.loading = this._serviceExamen.isLoading || this._tipoService.isLoading || this._materialService.isLoading;
    });

    this._materialService.source$.subscribe(data => this.materialesMicas = data);
    this._tipoService.source$.subscribe(data => this.tiposMicas = data);
  }

  ngOnInit() {
    this.createSubscriptions();
    // Obtiene los valores para las micas
    this._materialService.getList();
    this._tipoService.getList();
    // Obtiene el ultimo examen del paciente
    if (this.pacienteID) {
      this._serviceExamen.getLastExamen(this.pacienteID)
        .subscribe((data: Examen) => {
          if (data) { this._examen = data; }
        });
    }
  }

  esMonofocal(key) {
    if (this.tiposMicas) {
      const tm = this.tiposMicas.find(tm => tm.key === key);
      return tm ? tm.tipoMica === 1 : false;
    } else { return false; }
  }

  onOjoDerechoChange(value: any) {
    this.ojoDerechoValid = value.isValid;
    if (value.isValid) { this._examen.ojoDerecho = value.value; }
  }

  onOjoIzquierdoChange(value: any) {
    this.ojoIzquierdoValid = value.isValid;
    if (value.isValid) { this._examen.ojoIzquierdo = value.value; }
  }

  onTipoMicaChange(value: number) {
    if (value === 0) {
      this._examen.adicion = null;
      this._examen.altura = null;
    }
    this.tipoMicaChange.emit({
      'key': 'tipoMicaRecomendado',
      'value': this.tiposMicas.filter(_m => _m.key === value)[0]
    });
  }

  onMaterialChange(value: number) {
    this.materialChange.emit({
      'key': 'materialRecomendado',
      'value': this.materialesMicas.filter(_m => _m.key === value)[0]
    });
  }

  savaExamen(value: any) {
    // Gets material based on ID
    const _material: MaterialMica = this.materialesMicas.find(_m => _m.key === value.material);
    const _tipo: TipoMica = this.tiposMicas.find(_t => _t.key === value.tipoMica);

    this._examen.materialRecomendadoID = _material.key;
    this._examen.materialRecomendado = _material.nombre;
    this._examen.tipoMicaRecomendadoID = _tipo.key;
    this._examen.tipoMicaRecomendado = _tipo.nombre;

    this._examen.oftalmologo = value.oftalmologo;
    this._examen.observaciones = value.observaciones;
    this._examen.esReceta = value.esReceta;

    if (value.adicion) { this._examen.adicion = value.adicion; }
    if (value.altura) { this._examen.altura = value.altura; }
  }

  onSaveExamen(value: any, isBudget?: boolean) {
    this.savaExamen(value);
    this._serviceExamen.saveExamen(this.pacienteID, this._examen)
      .subscribe((examen) => {
        this._examen = examen;
        this.onSaved.emit(new GraduacionEventChange(this.examen, isBudget ? 'presupuesto' : 'venta'));
      });
  }

  generarPresupuesto(value: any) { this.onSaveExamen(value, true); }
}
