import { Examen } from '../../models/examen.models';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graduacion-vista',
  templateUrl: './graduacion-vista.component.html',
  styleUrls: ['./graduacion-vista.component.scss']
})
export class GraduacionVistaComponent implements OnInit {

  @Input() examen: Examen;

  constructor() { }

  ngOnInit() {
  }

}
