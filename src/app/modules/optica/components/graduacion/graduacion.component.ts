import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

//Services
import { TratamientoMicasService } from './../../services/tratamiento-micas.service';
import { MaterialMicasService } from './../../services/material-micas.service';
import { FBTipoMicasService } from './../../services/tipo-micas.service';
import { ExamenService } from '../../services/examen.service';
//Models
import { Ojo, Examen, MaterialMica, TipoMica } from '../../models/examen.models';
import { Contacto } from 'app/modules/crm/models/crm.models';

export type GraduacionNextAction = 'venta' | 'presupuesto';

export class GraduacionEventChange{
  constructor(
    public value: Examen,
    public action: GraduacionNextAction
  ){

  }
}

@Component({
  selector: 'app-graduacion',
  templateUrl: './graduacion.component.html',
  styleUrls: ['./graduacion.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExamenService, FBTipoMicasService, MaterialMicasService, TratamientoMicasService]
})
export class GraduacionComponent implements OnInit {
  _examen: Examen;
  ojoDerechoValid: Boolean;
  ojoIzquierdoValid: Boolean;
  //Data
  tiposMicas: TipoMica[];
  materialesMicas: MaterialMica[];

  @Input() editable: boolean = true;
  @Input() pacienteID: string;
  @Input() paciente: Contacto;

  @Input() listaPrecioID: number;

  @Output() materialChange: EventEmitter<any> = new EventEmitter();
  @Output() tipoMicaChange: EventEmitter<any> = new EventEmitter();
  @Output() onSaved: EventEmitter<GraduacionEventChange> = new EventEmitter();

  constructor(private _serviceExamen: ExamenService, private _tipoService: FBTipoMicasService,
    private _materialService: MaterialMicasService, private _tratamientoService: TratamientoMicasService) { 
    this._examen = new Examen();
  }

  ngOnInit() {
    //Obtiene los valores para las micas
    this._materialService.getCatalogList((data: MaterialMica[]) => {
      this.materialesMicas = data;
    });
    this._tipoService.getCatalogList((data: TipoMica[]) => {
      data = data.sort(
        (v1: TipoMica, v2: TipoMica) => {
          if(v1.nombre < v2.nombre) return -1;
          if(v1.nombre > v2.nombre) return 1;
          return 0;
        });

      this.tiposMicas = [].concat(
        data.filter(data=> { return data.tipoMica === 1}),
        data.filter(data=> { return data.tipoMica === 0}), 
        data.filter(data=> { return data.tipoMica === 2})
      );
    });
    //Obtiene el ultimo examen del paciente
    if(this.pacienteID){
      this._serviceExamen.getLastExamen(this.pacienteID).subscribe((data: Examen) => {
        if(data){
          this._examen = data;
        }
      });
    }
  }

  esMonofocal(key){
    if(this.tiposMicas){
      let tm = this.tiposMicas.find(tm=> tm.key === key);
      return tm.tipoMica === 1;
    }
    else return false;
  }

  onOjoDerechoChange(value: any){
    this.ojoDerechoValid = value.isValid;
    if(value.isValid){
      this._examen.ojoDerecho = value.value;
    }
  }

  onOjoIzquierdoChange(value: any){
    this.ojoIzquierdoValid = value.isValid;
    if(value.isValid){
      this._examen.ojoIzquierdo = value.value;
    }
  }

  onTipoMicaChange(value: string){ 
    if(value === '0'){
      this._examen.adicion = null;
      this._examen.altura = null;
    }
    this.tipoMicaChange.emit({ 
      'key': 'tipoMicaRecomendado',
      'value': this.tiposMicas.filter(_m => _m.key === value)[0]
    });
  }

  onMaterialChange(value: string){ 
    this.materialChange.emit({ 
      'key': 'materialRecomendado',
      'value': this.materialesMicas.filter(_m => _m.key === value)[0]
    });
  }

  savaExamen(value: any){
    //Gets material based on ID
    let _material: MaterialMica = this.materialesMicas.filter(_m => _m.key === value.material)[0];

    let _tipo: TipoMica = this.tiposMicas.filter(_t => _t.key === value.tipoMica)[0];

    this._examen.materialRecomendadoID = _material.key.toString();
    this._examen.materialRecomendado = _material.nombre;
    this._examen.tipoMicaRecomendadoID = _tipo.key.toString();
    this._examen.tipoMicaRecomendado = _tipo.nombre;

    this._examen.oftalmologo = value.oftalmologo;
    this._examen.observaciones = value.observaciones;
    this._examen.esReceta = value.esReceta;

    if(value.adicion){
      this._examen.adicion = value.adicion;
    }
    if(value.altura){
      this._examen.altura = value.altura;
    }
  }

  onSaveExamen(value: any, isBudget?: boolean){
    this.savaExamen(value);
    this._examen.key = this._serviceExamen.saveExamen(this.pacienteID, this._examen);
    this.onSaved.emit(new GraduacionEventChange(this._examen, isBudget ? 'presupuesto' : 'venta'));
  }

  generarPresupuesto(value: any){
    this.onSaveExamen(value, true);
  }
}
