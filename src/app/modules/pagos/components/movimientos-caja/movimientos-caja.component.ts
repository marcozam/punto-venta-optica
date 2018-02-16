import { Component, OnInit, Input, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { CajaService } from '../../services/caja.service';
import { VentaOptikaTicketService } from 'app/modules/venta/services/tickets/venta-optika-ticket.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';

import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
import { MovimientoCaja } from '../../models/caja.models';

import { WarningTitle, SuccessTitle } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'app-movimientos-caja',
  templateUrl: './movimientos-caja.component.html',
  styleUrls: ['./movimientos-caja.component.scss'],
  providers: [DecimalPipe, DatePipe, VentaOptikaTicketService, CajaService]
})
export class MovimientosCajaComponent implements OnInit, AfterViewInit {

  dataSource: TableSource<MovimientoCaja>;
  loading$: Observable<boolean>;
  loading = false;
  private _corteID = 0;
  private _sucursalID: number;

  // Add setters
  @Input()
  get corteID(): number { return this._corteID; }
  set corteID(value: number){
    this._corteID = value;
    this.loadData();
  }
  @Input()
  get sucursalID(): number { return this._sucursalID; }
  set sucursalID(value: number){
    this._sucursalID = value;
    this.loadData();
  }

  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

  constructor(
    private _service: CajaService,
    private _printVentaService: VentaOptikaTicketService,
    private _dialog: DialogBoxService,
    private _decimal: DecimalPipe,
    private _date: DatePipe) {
    this.dataSource = new TableSource();
    // Defines Columns
    this.dataSource.columns = [
      new TableColumn('Orden', 'orden', item => item.ordenVentaID),
      new TableColumn('Fecha', 'fecha', item => this._date.transform(item.fecha, 'dd MMM yyyy HH:mm')),
      new TableColumn('Movimiento', 'movimiento', item => item.esPagoInicial ? item.totalVenta === item.monto ? 'Venta' : 'Anticipo' : 'Abono'),
      new TableColumn('Metodo de Pago', 'metodoPago', item => item.metodoPago.nombre),
      new TableColumn('Cliente', 'cliente', item => item.nombreCliente),
      new TableColumn('Lo Atendio', 'usuario', item => item.nombreUsuario),
      new TableColumn('Monto', 'monto', item => `$ ${this._decimal.transform(item.monto, '1.2-2')}`, true, item => item.monto),
    ];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Set Template for Actions
    this.dataSource.actionsTemplate = this.actionsTemplate;
  }

  loadData() {
    if (this.sucursalID) {
      this.loading = true;
      this._service.getMovimientosCorte(this.sucursalID, this.corteID)
        .subscribe(result => {
          // Create an emitter
          // this.corte.movimientos = result;
          this.dataSource.updateDataSource(result);
          this.loading = false;
        });
    }
  }

  onPrintTicket(ordenVentaID: number, esPagoInicial: boolean) {
    this._printVentaService.esPagoInicial = esPagoInicial;
    this._printVentaService.corteID = 0;
    this._printVentaService.getServerData(ordenVentaID);
  }

  onCancel(item: MovimientoCaja) {
    // Send warning
    this._dialog.openDialog(WarningTitle,
      `Esta seguro que desea eliminar. el movimiento de la orden ${item.ordenVentaID}. Por un monto de ${item.monto}`, true, (r) => {
        if (r) {
          this._service.deleteMovimientoCaja(item)
            .subscribe(() => {
              this._dialog.openDialog(SuccessTitle, 'El movimiento ha sido eliminado con exito');
            });
        }
      });
  }
}
