import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MedidasArmazon } from 'app/modules/optica/models/armazon.models';

@Component({
  selector: 'app-medidas-armazon',
  templateUrl: './medidas-armazon.component.html',
  styleUrls: ['./medidas-armazon.component.scss']
})
export class MedidasArmazonComponent implements OnInit {

  @ViewChild('medidasForm', { static: true }) form: NgForm;

  medidas: MedidasArmazon | null;

  @Output()
  onChange: EventEmitter<MedidasArmazon> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.form.valueChanges.subscribe((value: MedidasArmazon) => {
      if(this.form.valid && this.form.dirty){
        this.emitChanges(value);
      }
      else{
        this.emitChanges(null);
      }
    })
  }

  emitChanges(value: MedidasArmazon){
    if(this.medidas !== value){
      this.medidas = value;
      this.onChange.emit(this.medidas);
    }
  }
}
