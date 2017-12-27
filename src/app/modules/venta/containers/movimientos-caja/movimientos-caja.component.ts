import { Component, OnInit } from '@angular/core';
import { CajaService } from 'app/modules/venta/services/caja.service';
import { MovimientoCaja } from 'app/modules/venta/models/caja.models';
import { ImpresionTicketService } from 'app/modules/venta/services/impresion-ticket.service';
import { VentaService } from 'app/modules/venta/services/venta.service';
import { VentaTicketService } from 'app/modules/venta/services/venta-ticket.service';

@Component({
  selector: 'app-movimientos-caja',
  templateUrl: './movimientos-caja.component.html',
  styleUrls: ['./movimientos-caja.component.scss'],
  providers: [CajaService, VentaTicketService]
})
export class MovimientosCajaComponent implements OnInit {
  sucursalID: number;
  movimientos: MovimientoCaja[];

  constructor(
    private service: CajaService,
    private _printVentaService: VentaTicketService) { }

  ngOnInit() {
    this.sucursalID = 1;
    this.service.getMovimientosSinCorte(this.sucursalID, res => this.movimientos = res);
  }

  onPrintTicket(ordenVentaID: number, esPagoInicial: boolean){
    this._printVentaService.esPagoInicial = esPagoInicial;
    this._printVentaService.corteID = 0;
    
    this._printVentaService.getServerData(ordenVentaID);
  }
}
