import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
// Models
import { Ojo } from '../../models/examen.models';

@Component({
  selector: 'app-ojo',
  templateUrl: './ojo.component.html',
  styleUrls: ['./ojo.component.scss'],
})
export class OjoComponent implements OnInit {

  @ViewChild(NgForm, { static: true }) form;

  _invalid: Boolean = true;
  @Input()
  get invalid(): Boolean { return this._invalid; }
  set invalid(value) {
    this._invalid = value;
    this.invalidChange.emit(value);
  }
  @Output() invalidChange = new EventEmitter<Boolean>();

  _ojo: Ojo;
  @Input()
  get ojo(): Ojo { return this._ojo; }
  set ojo(value) {
    this._ojo = value;
    this.ojoChange.emit(value);
  }
  @Output() ojoChange = new EventEmitter<Ojo>();

  @Input() editable = true;

  constructor() { }

  ngOnInit() { this.form.valueChanges.subscribe(() => this.invalid = this.form.invalid ); }

  gradosHabilitados(value: number| null) {
    if (value) { return (value !== 0); }
    return false;
  }
}
