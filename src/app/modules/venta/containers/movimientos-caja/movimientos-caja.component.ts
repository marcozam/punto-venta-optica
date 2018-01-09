import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DecimalPipe, DatePipe } from '@angular/common';

import { environment } from '../../../../../environments/environment';

//Services
import { CajaService } from 'app/modules/venta/services/caja.service';
import { VentaTicketService } from 'app/modules/venta/services/venta-ticket.service';
//Models
import { MovimientoCaja, CorteCaja } from 'app/modules/venta/models/caja.models';
import { TableSource, TableColumn } from 'app/modules/base/models/base.models';

import { RegistrarCorteComponent } from 'app/modules/venta/components/registrar-corte/registrar-corte.component';

import { Observable } from 'rxjs/Observable';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { SuccessMessage, SuccessTitle, WarningTitle } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'app-movimientos-caja',
  templateUrl: './movimientos-caja.component.html',
  styleUrls: ['./movimientos-caja.component.scss'],
  providers: [CajaService, VentaTicketService]
})
export class MovimientosCajaComponent implements OnInit, AfterViewInit {
  
  sucursalID: number;
  dataSource: TableSource<MovimientoCaja>;
  corte: CorteCaja;
  loading$: Observable<boolean>;
  loading: boolean = false;

  @ViewChild("actionsTemplate") 
  actionsTemplate: TemplateRef<any>;

  constructor(
    private _service: CajaService,
    private _printVentaService: VentaTicketService,
    private _matDialog: MatDialog,
    private _dialog: DialogBoxService,
    private _decimal: DecimalPipe, 
    private _date: DatePipe) {
      this.dataSource = new TableSource();
      //Defines Columns
      this.dataSource.columns = [
        new TableColumn('Orden', 'orden', item => item.ordenVentaID),
        new TableColumn('Fecha', 'fecha', item => this._date.transform(item.fecha, 'dd MMM yyyy HH:mm')),
        new TableColumn('Movimiento', 'movimiento', item => item.esPagoInicial ? 'Venta' : 'Abono'),
        new TableColumn('Cliente', 'cliente', item => item.nombreCliente),
        new TableColumn('Lo Atendio', 'usuario', item => item.nombreUsuario),
        new TableColumn('Monto', 'monto', item => `$ ${this._decimal.transform(item.monto, '1.2-2')}`, true, item => item.monto),
        new TableColumn('Venta', 'venta', item => `$ ${this._decimal.transform(item.totalVenta, '1.2-2')}`, true, item => item.totalVenta)
      ]
    }

  ngOnInit() {
    this.sucursalID = 1;
    this.corte = new CorteCaja(this.sucursalID, environment.defaultUser);

    this._service.getSummaryCortePendiente(this.sucursalID)
      .subscribe(result => {
        this.corte.detalle = result;
        this.corte.totalEsperado = this.corte.detalle.length > 0 ? 
          this.corte.detalle.map(d=> d.montoEsperado).reduce((p, c)=> p + c) : 0;
      });

    this._service.getMovimientosSinCorte(this.sucursalID)
      .subscribe(result => {
        this.corte.movimientos = result;
        this.dataSource.updateDataSource(result)
      });;
  }

  ngAfterViewInit(){
    //Set Template for Actions
    this.dataSource.actionsTemplate = this.actionsTemplate;
  }

  openDialog(){
    if(this.corte.detalle.length > 0){
      let dialogRef = this._matDialog.open(RegistrarCorteComponent, { data: this.corte.detalle });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.corte.totalRecibido = this.corte.detalle.length > 0 ? 
              this.corte.detalle.map(d=> d.montoRecibido).reduce((p, c)=> p + c) : 0;
          this._service.save(this.corte, null)
            .subscribe(result=>{
              this._dialog.openDialog(SuccessTitle, SuccessMessage);
              this.dataSource.updateDataSource([])
              this.corte = new CorteCaja(this.sucursalID, environment.defaultUser);
            });
        }
      });
    }
    else this._dialog.openDialog(WarningTitle, 'No existen movimiento para realizar el corte');
  }

  onPrintTicket(ordenVentaID: number, esPagoInicial: boolean){
    this._printVentaService.esPagoInicial = esPagoInicial;
    this._printVentaService.corteID = 0;
    
    this._printVentaService.getServerData(ordenVentaID);
  }
}
