import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddDescuentoProductoComponent } from '../../components/add-descuento-producto/add-descuento-producto.component';

import { DetalleVenta, SumaryVenta } from '../../models/venta.models';

let unique_id: number;

@Component({
  selector: 'os-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss'],
  host: { 'class': 'row' }
})
export class DetalleVentaComponent {

  index: number;

  // 2 Way Data Binding
  private _detalleVenta: DetalleVenta[];
  @Output() detalleVentaChange: EventEmitter<DetalleVenta[]> = new EventEmitter();
  @Input()
  get detalleVenta(): DetalleVenta[] { return this._detalleVenta; }
  set detalleVenta(value){
    this._detalleVenta = value;
    this.detalleVentaChange.emit(this._detalleVenta);
  }

  @Input() sumaryVenta: SumaryVenta;

  constructor(public matDialog: MatDialog) { this.index = unique_id++; }

  onCantidadChange(cantidad: number, item: DetalleVenta) { item.cantidad = cantidad; }

  onEliminarProducto(detalle: DetalleVenta) {
    this.detalleVenta = this.detalleVenta.filter(dv => dv.productoVenta.key !== detalle.productoVenta.key);
  }

  openDescuentoItem(item: DetalleVenta) {
    const copy = Object.assign(new DetalleVenta(item.productoVenta), item);
    const dialogRef = this.matDialog.open(AddDescuentoProductoComponent, { data: { Detalle: copy } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detalleVenta = this.detalleVenta
          .filter(dv => dv.productoVenta.key !== result.Data.productoVenta.key)
          .concat([result.Data]);
      }
    });
  }
}
