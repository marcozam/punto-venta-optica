import { Component, TemplateRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
// Services
import { VentaOptikaTicketService } from 'app/modules/venta/services/tickets/venta-optika-ticket.service';
import { DialogPagosService } from 'app/modules/venta-common/services/dialog-pagos.service';
import { VentaService } from 'app/modules/venta/services/venta.service';
// Models
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
import { Venta, DetallePagos } from 'app/modules/venta/models/venta.models';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.scss'],
  providers: [VentaService, DialogPagosService, VentaOptikaTicketService, DecimalPipe, DatePipe]
})
export class ListaVentasComponent implements AfterViewInit {

  private _ventasSource: Venta[];
  @Input()
  get ventasSource(): Venta[] { return this.ventasSource; }
  set ventasSource(value) {
    this._ventasSource = value ? value : [];
    this.dataSource.updateDataSource(this._ventasSource);
    this.loading = false;
  }

  dataSource: TableSource<Venta>;
  loading = false;

  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

  constructor(
    private ventaService: VentaService,
    private _printVentaService: VentaOptikaTicketService,
    private pagosDialog: DialogPagosService,
    private _decimal: DecimalPipe,
    private _date: DatePipe,
  ) {
    this.dataSource = new TableSource();
    this.dataSource.columns = [
      new TableColumn('Orden', 'orden', item => item.sumary.key),
      new TableColumn('Fecha', 'fecha', item => this._date.transform(item.sumary.fecha, 'dd MMM yyyy HH:mm')),
      new TableColumn('Status', 'status', item => item.sumary.status.nombre),
      new TableColumn('Cliente', 'cliente', item => item.sumary.cliente.nombre),
      new TableColumn('Total Venta', 'total', item => `$ ${this._decimal.transform(item.sumary.total, '1.2-2')}`, true, item => item.sumary.total),
      new TableColumn('Total Pagado', 'totalPagado', item => `$ ${this._decimal.transform(item.sumary.totalPagado, '1.2-2')}`, true, item => item.sumary.totalPagado),
      new TableColumn('Saldo', 'saldo', item => `$ ${this._decimal.transform(item.sumary.saldo, '1.2-2')}`, true, item => item.sumary.saldo)
    ];
  }

  ngAfterViewInit() {
    // Set Template for Actions
    this.dataSource.actionsTemplate = this.actionsTemplate;
  }

  generarPago(venta: Venta) {
    this.pagosDialog.openDialog(venta, (dp: DetallePagos[]) => {
      if (dp) {
        if (dp.length > 0) {
          this.ventaService.registarPago(Number(venta.sumary.key), dp)
            .subscribe(() => {
              let totalAbono = dp[0].monto;
              if (dp.length > 1) { totalAbono = dp.map(item => item.monto).reduce((p, c) => p + c); }
              venta.sumary.totalPagado = venta.sumary.totalPagado + totalAbono;
              this._printVentaService.esPagoInicial = false;
              this._printVentaService.corteID = 0;
              this._printVentaService.getServerData(Number(venta.sumary.key));
              if (venta.sumary.saldo === 0 && venta.sumary.status.key === 40203) {
                this.dataSource.updateDataSource(this.dataSource.data.filter(vta => vta.sumary.key !== venta.sumary.key));
              } else { this.dataSource.refresh(); }
            });
        }
      }
    });
  }

  entregarOrden(venta: Venta) {
    this.ventaService.changeStatus(Number(venta.sumary.key), 40203)
      .subscribe(() => {
        this.dataSource.updateDataSource(this.dataSource.data.filter(vta => vta.sumary.key !== venta.sumary.key));
      });
  }
}
