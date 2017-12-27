import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddDescuentoProductoComponent } from '../../components/add-descuento-producto/add-descuento-producto.component';

import { DetalleVenta, SumaryVenta } from '../../models/venta.models';

let unique_id: number;

@Component({
  selector: 'os-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss'],
  host:{
    'class': 'row'
  }
})
export class DetalleVentaComponent implements OnInit {
  @Input() detalleVenta: DetalleVenta[];
  @Input() sumaryVenta: SumaryVenta;
  @Output() detalleChanged: EventEmitter<any[]> = new EventEmitter();
  index: number;

  constructor(
    public matDialog: MatDialog
  ) { 
    this.index = unique_id++;
  }

  ngOnInit() {

  }

  onEliminarProducto(detalle: DetalleVenta){
    this.detalleVenta = this.detalleVenta.filter(dv=> dv.productoVenta.key !== detalle.productoVenta.key);
    this.detalleChanged.emit();
  }

  onCantidadChange(cantidad: number, item: DetalleVenta){
    item.cantidad = cantidad;
    this.detalleChanged.emit();
  }

  openDescuentoItem(item: DetalleVenta){
    let copy = Object.assign(new DetalleVenta(item.productoVenta), item);
    let dialogRef = this.matDialog.open(AddDescuentoProductoComponent, {
      data: { Detalle: copy }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //let idx = this.detalleVenta.findIndex(dv => dv.productoVenta.key === result.Data.productoVenta.key);
        //this.detalleVenta[idx] = result.Data;
        this.detalleChanged.emit([result.Data]);
      }
    });
  }
}