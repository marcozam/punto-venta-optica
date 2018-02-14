import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { merge } from 'rxjs/Observable/merge';
import { FormControl, NgForm } from '@angular/forms';
// Models
import { Ojo } from '../../models/examen.models';

@Component({
  selector: 'app-ojo',
  templateUrl: './ojo.component.html',
  styleUrls: ['./ojo.component.scss'],
})
export class OjoComponent implements OnInit {
  @ViewChild(NgForm) form;
  @Input() ojo: Ojo;
  @Input() editable = true;
  @Output() onChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.form.valueChanges.subscribe((data) => { this.pushChanges(data); });
  }

  onCilindroChange(valor: number) { }

  pushChanges(item: any) {
    this.onChange.emit({
      value: item,
      isValid: this.form.valid
    });
  }

  gradosHabilitados(value: number| null) {
    if (value) { return (value !== 0); }
    return false;
  }
}
