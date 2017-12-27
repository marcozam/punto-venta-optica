import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DetalleVenta } from 'app/modules/venta/models/venta.models';

@Component({
  selector: 'app-add-descuento-producto',
  templateUrl: './add-descuento-producto.component.html',
  styleUrls: ['./add-descuento-producto.component.scss']
})
export class AddDescuentoProductoComponent implements OnInit {

  detalle: DetalleVenta;

  constructor(
    public dialogRef: MatDialogRef<AddDescuentoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.detalle = data.Detalle;
  }

  ngOnInit() {
    
  }

  onValueChange(value, tipoDescuento){
    this.detalle.tipoDescuentoID = tipoDescuento;
    this.detalle.valorDescuento = value;
    //Porcentaje
    if(tipoDescuento === 1){
      this.detalle.descuento = this.detalle.precioUnitario * (value / 100);
    }
    //Ajuste de Precio
    else if (tipoDescuento === 2){
      this.detalle.descuento = this.detalle.precioUnitario - value;
    }
  }

  onAplicarDescuento(){
    this.dialogRef.close({ Data: this.detalle});
  }
}
