import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

//Services
import { TratamientoMicasService } from './../../services/tratamiento-micas.service';
import { MaterialMicasService } from './../../services/material-micas.service';
import { TipoMicasService } from './../../services/tipo-micas.service';
import { ExamenService } from '../../services/examen.service';
//Models
import { Ojo, Examen, MaterialMica, TipoMica } from '../../models/examen.models';
import { Contacto } from 'app/modules/crm/models/crm.models';

export type GraduacionNextAction = 'venta' | 'presupuesto';

export class GraduacionEventChange{
  constructor(
    public value: Examen,
    public action: GraduacionNextAction
  ){ }
}

@Component({
  selector: 'app-graduacion',
  templateUrl: './graduacion.component.html',
  styleUrls: ['./graduacion.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExamenService, TipoMicasService, MaterialMicasService, TratamientoMicasService]
})
export class GraduacionComponent implements OnInit {
  _examen: Examen;
  ojoDerechoValid: Boolean;
  ojoIzquierdoValid: Boolean;
  //Data
  tiposMicas: TipoMica[];
  materialesMicas: MaterialMica[];

  loading$: Observable<boolean>;
  loading: boolean = false;

  @Input() editable: boolean = true;
  @Input() pacienteID: number;
  @Input() paciente: Contacto;
  @Input() listaPrecioID: number;
  @Output() materialChange: EventEmitter<any> = new EventEmitter();
  @Output() tipoMicaChange: EventEmitter<any> = new EventEmitter();
  @Output() onSaved: EventEmitter<GraduacionEventChange> = new EventEmitter();

  constructor(
    private _serviceExamen: ExamenService, 
    private _tipoService: TipoMicasService,
    private _materialService: MaterialMicasService, 
    private _tratamientoService: TratamientoMicasService) { 
    this._examen = new Examen();
    //Observer when app is retriving data
    this.loading$ = Observable.merge(_serviceExamen.loading$, 
                                    _tipoService.loading$, 
                                    _materialService.loading$,
                                  _tratamientoService.loading$);
  }

  createSubscriptions(){
    this.loading$.subscribe((isLoading: boolean) => this.loading = this._serviceExamen.isLoading 
        || this._tipoService.isLoading || this._materialService.isLoading || this._tratamientoService.isLoading);

    this._materialService.source$
      .subscribe(data => this.materialesMicas = data);
    this._tipoService.source$
      .subscribe(data => this.tiposMicas = data);
  }

  ngOnInit() {
    this.createSubscriptions();
    //Obtiene los valores para las micas
    this._materialService.getList();
    this._tipoService.getList();
    //Obtiene el ultimo examen del paciente
    if(this.pacienteID){
      this._serviceExamen.getLastExamen(this.pacienteID)
        .subscribe((data: Examen) => {
          if(data) this._examen = data;
        });
    }
  }

  esMonofocal(key){
    if(this.tiposMicas){
      let tm = this.tiposMicas.find(tm=> tm.key === key);
      return tm ? tm.tipoMica === 1 : false;
    }
    else return false;
  }

  onOjoDerechoChange(value: any){
    this.ojoDerechoValid = value.isValid;
    if(value.isValid) this._examen.ojoDerecho = value.value;
  }

  onOjoIzquierdoChange(value: any){
    this.ojoIzquierdoValid = value.isValid;
    if(value.isValid) this._examen.ojoIzquierdo = value.value;
  }

  onTipoMicaChange(value: number){ 
    if(value === 0){
      this._examen.adicion = null;
      this._examen.altura = null;
    }
    this.tipoMicaChange.emit({ 
      'key': 'tipoMicaRecomendado',
      'value': this.tiposMicas.filter(_m => _m.key === value)[0]
    });
  }

  onMaterialChange(value: number){ 
    this.materialChange.emit({ 
      'key': 'materialRecomendado',
      'value': this.materialesMicas.filter(_m => _m.key === value)[0]
    });
  }

  savaExamen(value: any){
    //Gets material based on ID
    let _material: MaterialMica = this.materialesMicas.filter(_m => _m.key === value.material)[0];
    let _tipo: TipoMica = this.tiposMicas.filter(_t => _t.key === value.tipoMica)[0];

    this._examen.materialRecomendadoID = _material.key;
    this._examen.materialRecomendado = _material.nombre;
    this._examen.tipoMicaRecomendadoID = _tipo.key;
    this._examen.tipoMicaRecomendado = _tipo.nombre;

    this._examen.oftalmologo = value.oftalmologo;
    this._examen.observaciones = value.observaciones;
    this._examen.esReceta = value.esReceta;

    if(value.adicion) this._examen.adicion = value.adicion;
    if(value.altura) this._examen.altura = value.altura;
  }

  onSaveExamen(value: any, isBudget?: boolean){
    this.savaExamen(value);
    this._serviceExamen.saveExamen(this.pacienteID, this._examen)
      .subscribe((examen)=>{
        this._examen = examen;
        this.onSaved.emit(new GraduacionEventChange(this._examen, isBudget ? 'presupuesto' : 'venta'));
      });
  }

  generarPresupuesto(value: any){ this.onSaveExamen(value, true); }
}
