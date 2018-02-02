import { Component, OnInit } from '@angular/core';
import { VentasReportingService } from 'app/modules/venta/services/ventas-reporting.service';
import { ResumenVenta, Ingresos } from 'app/modules/venta/models/ventas-reporting.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-resumen-venta-mes',
  templateUrl: './resumen-venta-mes.component.html',
  styleUrls: ['./resumen-venta-mes.component.scss'],
  providers: [VentasReportingService]
})
export class ResumenVentaMesComponent implements OnInit {

  selectedMonth: number;
  selectedYear: number;
  sucursalID: number;
  resumen: ResumenVenta;

  dsIngresos: TableSource<Ingresos>;
  dsOftalmologos: TableSource<any>;
  dsLentes: TableSource<any>;

  constructor(
    private _ventaReporting: VentasReportingService,
    private _decimal: DecimalPipe) {
    this.dsIngresos = new TableSource();
    this.dsOftalmologos = new TableSource();
    this.dsLentes = new TableSource();
    //Defines Columns
    this.dsIngresos.columns = [
      new TableColumn('Forma Pago', 'formaPago', item => item.metodPago.nombre),
      new TableColumn('Monto', 'monto', item => `$ ${this._decimal.transform(item.monto, '1.2-2')}`, true, item => item.monto),
    ]
    this.dsOftalmologos.columns = [
      new TableColumn('Oftalmologo', 'oftalmologo', item => item.nombre),
      new TableColumn('No Examenes', 'noExamenes', item => item.noExamenes),
    ]
    this.dsLentes.columns = [
      new TableColumn('Armazon', 'armazon', item => item.armazon),
      new TableColumn('No Ventas', 'noVentas', item => item.noVentas),
    ]
   }

  ngOnInit() {
    this.sucursalID = 1;
  }

  getResume(){
    this._ventaReporting.getResumenMensual(this.selectedMonth, this.selectedYear, this.sucursalID)
      .subscribe((data)=>{
        this.resumen = data;
        this.dsIngresos.updateDataSource(data.ingresos);
        this._ventaReporting.getResumenMensualOptika(this.selectedMonth, this.selectedYear, this.sucursalID)
          .subscribe((dataOptika)=>{
            this.dsOftalmologos.updateDataSource(dataOptika.oftalmologos);
            this.dsLentes.updateDataSource(dataOptika.armazones);
          });
      })
  }

}
