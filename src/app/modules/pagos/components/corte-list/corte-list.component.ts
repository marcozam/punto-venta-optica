import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

import { DecimalPipe, DatePipe } from '@angular/common';

import { CorteTicketService } from '../../services/tickets/corte-ticket.service';
import { CajaService } from '../../services/caja.service';

import { CorteCaja, DetalleCorteCaja } from '../../models/caja.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'app-corte-list',
  templateUrl: './corte-list.component.html',
  styleUrls: ['./corte-list.component.scss'],
  providers: [ CajaService, CorteTicketService, DecimalPipe, DatePipe ]
})
export class CorteListComponent implements OnInit, AfterViewInit {

  dataSource: TableSource<CorteCaja>;
  detailsDataSource: TableSource<DetalleCorteCaja>;
  selectedCorte: CorteCaja;
  showDetails = false;
  showMovimeintos = false;
  loadingDetail = false;
  sucursalID: number;

  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

  constructor(
    private _service: CajaService,
    private _ticket: CorteTicketService,
    private _decimal: DecimalPipe,
    private _date: DatePipe) {
      this.dataSource = new TableSource();
      this.detailsDataSource = new TableSource();

      // Defines Columns
      this.dataSource.columns = [
        new TableColumn('Folio', 'id', item => item.key),
        new TableColumn('Fecha', 'fecha', item => this._date.transform(item.fechaCorte, 'dd MMM yyyy HH:mm')),
        new TableColumn('Cajero', 'usuario', item => item.usuario.nombre),
        new TableColumn('Sucursal', 'sucursal', item => item.sucursal.nombre),
        new TableColumn('Diferencia Total', 'diferencia', item => `$ ${this._decimal.transform(item.diferencia, '1.2-2')}`, true, item => item.diferencia)
      ];
      this.detailsDataSource.columns = [
        new TableColumn('Metodo de Pago', 'metodoPago', item => item.metodoPago.nombre),
        new TableColumn('Esperado', 'esperado', item => `$ ${this._decimal.transform(item.montoEsperado, '1.2-2')}`, true, item => item.montoEsperado),
        new TableColumn('Recibido', 'recibido', item => `$ ${this._decimal.transform(item.montoRecibido, '1.2-2')}`, true, item => item.montoRecibido),
        new TableColumn('Diferencia', 'diferencia', item => `$ ${this._decimal.transform(item.diferencia, '1.2-2')}`, true, item => item.diferencia),
      ];
    }

  ngOnInit() {
    this.sucursalID = 1;
    this._service.getCortes(this.sucursalID)
      .subscribe(result => this.dataSource.updateDataSource(result));
  }

  ngAfterViewInit() {
    // Set Template for Actions
    this.dataSource.actionsTemplate = this.actionsTemplate;
  }

  printTicket(item: CorteCaja) {
    this._ticket.corte = item;
    this._service.getDetalleCorte(Number(item.key))
        .subscribe(result => {
          item.detalle = result;
          this._ticket.print();
        });
  }

  mostarDetalle(item: CorteCaja) {
    this.selectedCorte = item;
    this.showDetails = true;
    if (item.detalle.length > 0) {
      this.detailsDataSource.updateDataSource(item.detalle);
    } else {
      this.loadingDetail = true;
      this._service.getDetalleCorte(Number(item.key))
        .subscribe(result => {
          item.detalle = result;
          this.detailsDataSource.updateDataSource(result);
          this.loadingDetail = false;
        });
    }
  }

  mostarMovimientos(item: CorteCaja) {
    this.selectedCorte = item;
    this.showDetails = false;
    this.showMovimeintos = true;
  }
}
