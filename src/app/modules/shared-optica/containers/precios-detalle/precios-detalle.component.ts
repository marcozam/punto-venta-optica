import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-precios-detalle',
  templateUrl: './precios-detalle.component.html',
  styleUrls: ['./precios-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreciosDetalleComponent implements OnInit {

  listaPreciosID: number;

  constructor() { }

  ngOnInit() {
    this.listaPreciosID = 1;
  }

}
