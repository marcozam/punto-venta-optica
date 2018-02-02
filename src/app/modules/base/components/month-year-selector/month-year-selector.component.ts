import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { months } from 'app/modules/base/constants/date-time.constants';

@Component({
  selector: 'os-month-year-selector',
  templateUrl: './month-year-selector.component.html',
  styleUrls: ['./month-year-selector.component.scss']
})
export class MonthYearSelectorComponent implements OnInit {

  @Input() startYear: number = 2018;

  _month: number;
  _year: number;

  @Input()
  get month(): number { return this._month; }
  set month(value: number) { 
    if(value){ 
      this._month = value;
      this.monthChange.emit(value);
    }
  }
  @Output() monthChange: EventEmitter<number> = new EventEmitter();

  @Input()
  get year(): number { return this._year; }
  set year(value: number) { 
    if(value){ 
      this._year = value;
      this.yearChange.emit(value);
    }
  }
  @Output() yearChange: EventEmitter<number> = new EventEmitter();

  years: number[];
  _months = months;

  constructor() {  }

  ngOnInit() {
    this.years = [];
    let today = new Date();
    let _year = this.year ? this.year : today.getFullYear();

    //Hack to avoid Angular error
    if(!this.month) setTimeout(()=> this.month = today.getMonth() + 1);
    if(!this.year) setTimeout(()=> this.year = _year);

    //Set next 10 years
    for(let i = 0; i < 10; i++)
      this.years = this.years.concat([this.startYear + i]);
  }
}
