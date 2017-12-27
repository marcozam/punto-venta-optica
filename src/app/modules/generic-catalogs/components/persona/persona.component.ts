import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { PersonasService } from '../../services/personas.service';
import { Persona } from '../../models/generic-catalogs.models';

@Component({
  selector: 'os-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss'],
  providers:[PersonasService, DialogBoxService]
})
export class PersonaComponent implements OnInit {

  persona: Persona;

  @ViewChild('formPersona')
  form: NgForm

  @Input() initialData: Persona;
  @Input() ID: number;
  @Input() catalogName: string;
  @Input() isContact: boolean = true;

  @Output() onChange:EventEmitter<any> = new EventEmitter();

  constructor(
    private _service: PersonasService,
  ) { 
    this.persona = new Persona();
    this.catalogName = '';
  }

  ngOnInit() {
      if(this.ID){
        this._service.getByID(this.ID).subscribe((data: Persona) => this.persona = data);
      }
      else if(this.initialData){
        this.persona = this.initialData;
      }
      this.form.valueChanges.subscribe((val) => {
        this.onChange.emit({
          isValid: this.form.valid && this.form.dirty,
          data: val
        });
      })
  }
}