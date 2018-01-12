import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { MetodoPagoVentaComponent } from 'app/modules/venta/components/metodo-pago-venta/metodo-pago-venta.component';
import { Venta } from 'app/modules/venta/models/venta.models';

@Injectable()
export class DialogPagosService {

  constructor(public dialog: MatDialog){
  }

  openDialog(venta: Venta, _onClose: any){
    let dialogRef = this.dialog.open(MetodoPagoVentaComponent, {
      data: { Venta: venta }
    });
    dialogRef.afterClosed().subscribe(result => { 
      _onClose(result); 
    });
  }
}