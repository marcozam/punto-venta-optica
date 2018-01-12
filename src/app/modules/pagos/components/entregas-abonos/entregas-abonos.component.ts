import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
//Services
import { DialogPagosService } from '../../services/dialog-pagos.service';
import { VentaService } from 'app/modules/venta/services/venta.service';
import { VentaTicketService } from 'app/modules/venta/services/venta-ticket.service';
//Models
import { Venta, DetallePagos, SumaryVenta } from 'app/modules/venta/models/venta.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
import { Observable } from 'rxjs/Observable';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-entregas-abonos',
  templateUrl: './entregas-abonos.component.html',
  styleUrls: ['./entregas-abonos.component.scss'],
  providers: [VentaService, DialogPagosService, VentaTicketService]
})
export class EntregasAbonosComponent implements OnInit, AfterViewInit {

  sucursalID: number;
  ordenesPendienteEntrega: Venta[];
  dataSource: TableSource<Venta>;
  loading$: Observable<boolean>;
  loading: boolean = false;

  @ViewChild("actionsTemplate") 
  actionsTemplate: TemplateRef<any>;

  constructor(
    private ventaService: VentaService,
    private _printVentaService: VentaTicketService,
    private pagosDialog: DialogPagosService,
    private _decimal: DecimalPipe, 
    private _date: DatePipe,
  ) { 
    this.dataSource = new TableSource();
    //Defines Columns
    this.dataSource.columns = [
      new TableColumn('Orden', 'orden', item => item.sumary.key),
      new TableColumn('Fecha', 'fecha', item => this._date.transform(item.sumary.fecha, 'dd MMM yyyy HH:mm')),
      new TableColumn('Status', 'status', item => item.sumary.status.nombre),
      new TableColumn('Cliente', 'cliente', item => item.sumary.cliente.nombre),
      new TableColumn('Total Venta', 'total', item => `$ ${this._decimal.transform(item.sumary.total, '1.2-2')}`, true, item => item.sumary.total),
      new TableColumn('Total Pagado', 'totalPagado', item => `$ ${this._decimal.transform(item.sumary.totalPagado, '1.2-2')}`, true, item => item.sumary.totalPagado),
      new TableColumn('Saldo', 'saldo', item => `$ ${this._decimal.transform(item.sumary.saldo, '1.2-2')}`, true, item => item.sumary.saldo)
    ]
  }

  ngOnInit() {
    this.sucursalID = 1;
    this.ventaService.getOrdenesPendientesEntrega(this.sucursalID, result => {
      this.dataSource.updateDataSource(result);
    });
  }

  ngAfterViewInit(){
    //Set Template for Actions
    this.dataSource.actionsTemplate = this.actionsTemplate;
  }

  generarPago(venta: Venta){
    this.pagosDialog.openDialog(venta, (dp: DetallePagos[]) =>{
      if(dp.length > 0){
        this.ventaService.registarPago(Number(venta.sumary.key), dp)
          .subscribe(result =>{
            let totalAbono = dp[0].monto;
            if(dp.length > 1) {
              totalAbono = dp.map(item => item.monto).reduce((p, c)=> p +c);
            }
            venta.sumary.totalPagado = venta.sumary.totalPagado + totalAbono;
            this._printVentaService.esPagoInicial = false;
            this._printVentaService.corteID = 0;
            this._printVentaService.getServerData(Number(venta.sumary.key));
            if(venta.sumary.saldo === 0 && venta.sumary.status.key === 40203){
              this.dataSource.updateDataSource(this.dataSource.data.filter(vta=> vta.sumary.key !== venta.sumary.key));
            }
            else this.dataSource.refresh();
          });
      }
    });
  }

  entregarOrden(venta: Venta){
    this.ventaService.changeStatus(Number(venta.sumary.key), 40203)
      .subscribe(()=>{
        this.dataSource.updateDataSource(this.dataSource.data.filter(vta=> vta.sumary.key !== venta.sumary.key));
      });
  }

}
