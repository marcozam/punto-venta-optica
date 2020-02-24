import { Component, OnInit } from '@angular/core';
// Services
import { ApplicationService } from 'app/services';
import { MovimientosInventarioService } from 'app/modules/inventario/services/movimientos-inventario.service';
import { CategoriaProductoService } from 'app/modules/producto/services/categoria-producto.service';
// Models
import { MovimientoInventario, TipoMovimientoInventario } from 'models/inventario';
import { CategoriaProductoSumary } from 'app/modules/producto/models/producto.models';
import { OSPeriodo } from 'app/modules/base/models/time-frame.models';
import { periodos } from 'app/modules/base/constants/date-time.constants';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss'],
  providers: [ MovimientosInventarioService, CategoriaProductoService ],
})
export class MovimientosComponent implements OnInit {

  sucursalUuid: number;
  movimientos: MovimientoInventario[];
  movimientosFull: MovimientoInventario[];
  categorias: CategoriaProductoSumary[];
  tipoMovimientos: TipoMovimientoInventario[];

  // TODO: Add table component with filters
  // Filter Options
  showFilters = false;
  selectedCategory: CategoriaProductoSumary;
  selectedTipoMovimiento: TipoMovimientoInventario;

  _periodos: OSPeriodo[];

  constructor(
    private applicationService: ApplicationService,
    private service: MovimientosInventarioService,
    private _categoriaService: CategoriaProductoService
  ) {
    this._periodos = periodos;
  }

  createSubscriptions() {
    /*
    this.loading$.subscribe((isLoading: boolean) => {
      this.loading = this._categoriaService.isLoading || this._service.isLoading;
    });
    */
    this._categoriaService.source$.subscribe(result => this.categorias = result);
  }

  ngOnInit() {
    this.sucursalUuid = this.applicationService.sucursal.key;
    this._categoriaService.getStockCategories();
    this.service.getTipoMovimientos()
      .subscribe(res => this.tipoMovimientos = res);
  }

  onCategoriaChange(categoria: CategoriaProductoSumary) {
    this.selectedCategory = categoria;
    if (categoria.nombre === 'All') {
      this.selectedCategory = null;
    }
    this.applyFilters();
  }

  onTipoMovimientoChange(tipo: TipoMovimientoInventario) {
    this.selectedTipoMovimiento = tipo;
    if (tipo.nombre === 'All') {
      this.selectedTipoMovimiento = null;
    }
    this.applyFilters();
  }

  onRangoChanged(option: OSPeriodo) {
    const { start, end } = option.getTimeFrame();
    this.service.getMovimientos(this.sucursalUuid, start, end)
      .subscribe(res => this.movimientos = this.movimientosFull = res);
  }

  applyFilters() {
    this.movimientos = this.movimientosFull.filter(mi => {
      return (this.selectedCategory ? mi.producto.categoriaProductoID === this.selectedCategory.key : true)
        && (this.selectedTipoMovimiento ? mi.tipoMovimiento.key === this.selectedTipoMovimiento.key: true);
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
