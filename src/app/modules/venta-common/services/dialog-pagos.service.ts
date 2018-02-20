import { Injectable } from '@angular/core';
// Material
import { MatDialog } from '@angular/material/dialog';
// Components
import { MetodoPagoVentaComponent } from '../components/metodo-pago-venta/metodo-pago-venta.component';
// Models
import { Venta } from 'app/modules/venta/models/venta.models';

@Injectable()
export class DialogPagosService {

  constructor(public dialog: MatDialog) { }

  openDialog(venta: Venta, _onClose: any) {
    const dialogRef = this.dialog.open(MetodoPagoVentaComponent, { data: { Venta: venta } });
    dialogRef.afterClosed().subscribe(result => { _onClose(result); });
  }
}
