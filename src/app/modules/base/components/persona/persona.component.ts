import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { PersonasService } from 'app/modules/base/services/personas.service';
import { Persona } from 'app/modules/base/models/base.models';

@Component({
  selector: 'os-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss'],
  providers:[DialogBoxService]
})
export class PersonaComponent implements OnInit {

  persona: Persona;

  @ViewChild('formPersona')
  form: NgForm

  private _initialData: Persona;
  @Input() 
  get initialData(): Persona{
    return this._initialData;
  }
  set initialData(value: Persona) {
    this._initialData = value;
    if(value) this.persona = value;
  }
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
    if(this.ID) this._service.getByID(this.ID).subscribe((data: Persona) => this.persona = data);
    this.form.valueChanges.subscribe((val) => {
      this.onChange.emit({
        isValid: this.form.valid,
        data: Object.assign(this.persona, val)
      });
    })
  }
}