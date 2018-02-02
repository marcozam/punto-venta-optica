import { Component, OnInit } from '@angular/core';
import { OSPeriodo } from 'app/modules/base/models/time-frame.models';
import { periodos } from 'app/modules/base/constants/date-time.constants';

@Component({
  selector: 'os-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.scss']
})
export class DateSelectionComponent implements OnInit {

  _periodos: OSPeriodo[];

  constructor() { }

  ngOnInit() {
    this._periodos = periodos;
  }

}
