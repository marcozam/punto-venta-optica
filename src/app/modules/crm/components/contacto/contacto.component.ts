import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EmailValidator } from '@angular/forms';

import { ContactoService } from 'app/modules/crm/services/contacto.service';

import { TipoDatosContacto, Contacto, DatoContacto } from 'app/modules/crm/models/crm.models';
import { Persona } from 'app/modules/base/models/base.models';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { PersonasService } from 'app/modules/base/services/personas.service';

@Component({
  selector: 'os-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
  providers: [ContactoService, EmailValidator]
})
export class ContactoComponent implements OnInit {

  datosContacto = {
    telefono: null,
    email: null,
    colonia: null
  }

  get isNew(): boolean{
    return this.contactoID ? true : false;
  }

  private _contactoID: number;

  @Input()
  get contactoID(): number {
    return this._contactoID;
  }
  set contactoID(value: number){
    this._contactoID = value;
    this.getContactData();
  }

  @Input() catalogName: string;
  @Input() initialData: Persona;

  @Output() onChange:EventEmitter<any> = new EventEmitter();
  @Output() onCancel:EventEmitter<any> = new EventEmitter();
  
  contacto: Contacto;
  tiposDatosContacto: TipoDatosContacto[];
  isChildValid: boolean = false;

  constructor(
    private _personaService: PersonasService,
    private _contactoService: ContactoService,
    private dialog: DialogBoxService
  ) { }

  ngOnInit() {
    this.contacto = new Contacto();
    //this._contactoService.getTiposDatoContacto(res=> this.tiposDatosContacto = res);
  }

  getContactData(){
    if(this.contactoID){
      this._contactoService.getByID(this.contactoID)
        .subscribe(item=>{
          this.contacto = item;
          this.initialData = this.contacto.persona;

          this.datosContacto.telefono = item.datos.find(dc=> dc.nombre === 'TELEFONO');
          this.datosContacto.email = item.datos.find(dc=> dc.nombre === 'EMAIL');
          this.datosContacto.colonia = item.datos.find(dc=> dc.nombre === 'LOCALIDAD');
        });
    }
  }

  onPersonaChanged(event){
    this.isChildValid = event.isValid;
    if(this.isChildValid){
      this.contacto.persona = event.data;
    }
  }

  cancel(){
    this.onCancel.emit();
  }

  onSave(data){
    let datos: DatoContacto[] = [];
    if(data.telefono){
      let dcT = this.datosContacto.telefono;
      if(!dcT){
        dcT = new DatoContacto();
        dcT.nombre = 'TELEFONO';
        dcT.tipoContactoID = 1;
      }
      dcT.valor = data.telefono;
      datos.push(dcT);
    }
    if(data.email){
      let dcE = this.datosContacto.email;
      if(!dcE){
        dcE = new DatoContacto();
        dcE.nombre = 'EMAIL';
        dcE.tipoContactoID = 3;
      }
      dcE.valor = data.email;
      datos.push(dcE);
    }
    if(data.colonia){
      let dcC = this.datosContacto.colonia;
      if(!dcC) {
        dcC = new DatoContacto();
        dcC.nombre = 'LOCALIDAD';
        dcC.tipoContactoID = 10;
      }
      dcC.valor = data.email;
      datos.push(dcC);
    }

    //TODO: Add contact type
    this.contacto.tipoID = 1;
    this.contacto.datos = datos;
    this._personaService.save(this.contacto.persona)
      .subscribe((pRes: Persona) => {
        this.contacto.persona = pRes;
        this._contactoService.save(this.contacto)
          .subscribe((cRes) => this.onSaved(cRes));
      });
  }

  onSaved(data: Contacto){
    //this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    this.onChange.emit({ Data: data, isNew: this.isNew });
  }
}
