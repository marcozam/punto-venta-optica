import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../../../../environments/environment';

// Services
import { CorteTicketService } from '../../services/tickets/corte-ticket.service';
import { CajaService } from '../../services/caja.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
// Models
import { CorteCaja } from '../../models/caja.models';
// Components
import { RegistrarCorteComponent } from '../../components/registrar-corte/registrar-corte.component';
// Constants
import { WarningTitle } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'app-movimientos-sin-corte',
  templateUrl: './movimientos-sin-corte.component.html',
  styleUrls: ['./movimientos-sin-corte.component.scss'],
  providers: [CajaService, CorteTicketService]
})
export class MovimientosSinCorteComponent implements OnInit {

  sucursalID: number;
  corte: CorteCaja;

  constructor(
    private _service: CajaService,
    private _ticket: CorteTicketService,
    private _matDialog: MatDialog,
    private _dialog: DialogBoxService) { }

  ngOnInit() {
    this.sucursalID = 1;
    this.corte = new CorteCaja(this.sucursalID, environment.defaultUser);

    this._service.getSummaryCortePendiente(this.sucursalID)
      .subscribe(result => {
        this.corte.detalle = result;
        this.corte.totalEsperado = this.corte.detalle.length > 0 ?
          this.corte.detalle.map(d => d.montoEsperado).reduce((p, c) => p + c) : 0;
      });
  }

  openDialog() {
    if (this.corte.detalle.length > 0) {
      const dialogRef = this._matDialog.open(RegistrarCorteComponent, { data: this.corte.detalle });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.corte.totalRecibido = this.corte.detalle.length > 0 ?
              this.corte.detalle.map(d => d.montoRecibido).reduce((p, c) => p + c) : 0;
          this._service.save(this.corte, null)
            .subscribe(result => {
              this._ticket.corte = result;
              this._ticket.print();
              // this._dialog.openDialog(SuccessTitle, SuccessMessage);
              // TODO: Add option to update
              // this.dataSource.updateDataSource([])
              this.corte = new CorteCaja(this.sucursalID, environment.defaultUser);
            });
        }
      });
    } else {
      this._dialog.openDialog(WarningTitle, 'No existen movimiento para realizar el corte');
    }
  }
}
