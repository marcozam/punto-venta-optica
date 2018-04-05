import { Component, OnInit } from '@angular/core';
// Models
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
// Services
import { VentasReportingService } from '../../services/ventas-reporting.service';

interface VentaProductos {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-venta-productos',
  templateUrl: './resumen-venta-productos.component.html',
  styleUrls: ['./resumen-venta-productos.component.scss'],
  providers: [VentasReportingService]
})
export class ResumenVentaProductosComponent implements OnInit {

  dataSource: TableSource<VentaProductos>;
  data: VentaProductos[];
  selectedMonth: number;
  selectedYear: number;

  constructor(private _ventaReporting: VentasReportingService) {
    this.dataSource = new TableSource();
    this.dataSource.columns = [
      new TableColumn('Modelo', 'modelo', item => item.modelo),
      new TableColumn('Categoria', 'categoria', item => item.categoria),
      new TableColumn('Marca', 'marca', item => item.marca ? item.marca : 'Generica'),
      new TableColumn('Cantidad', 'cantidad', item => item.cantidad, true, item => item.cantidad)
    ];
    this.dataSource.columns[1].group = true;
    this.dataSource.columns[2].group = true;
  }

  ngOnInit() {
  }

  consultar() {
    this._ventaReporting
      .getProductosVendidos(this.selectedMonth, this.selectedYear, 1)
        .subscribe(value => {
          console.log(value);
          this.dataSource.updateDataSource(value);
        });
  }
}
