import { Component, OnInit } from '@angular/core';
import { Periodo } from 'app/modules/base/models/time-frame.models';
import { periodos } from 'app/modules/base/constants/date-time.constants';

@Component({
  selector: 'app-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.scss']
})
export class DateSelectionComponent implements OnInit {

  _periodos: Periodo[] = periodos;

  constructor() { }

  ngOnInit() {
  }

}
