import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MovimientosInventarioService } from 'app/modules/inventario/services/movimientos-inventario.service';
import { CategoriaProductoService } from 'app/modules/producto/services/categoria-producto.service';

import { MovimientoInventario, TipoMovimientoInventario } from 'app/modules/inventario/models/inventario.models';
import { CategoriaProductoSumary } from 'app/modules/producto/models/producto.models';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss'],
  providers: [MovimientosInventarioService, CategoriaProductoService]
})
export class MovimientosComponent implements OnInit {

  sucursalID: number;
  movimientos: MovimientoInventario[];
  movimientosFull: MovimientoInventario[];
  categorias: CategoriaProductoSumary[];
  tipoMovimientos: TipoMovimientoInventario[]

  //TODO: Add table component with filters
  //Filter Options
  showFilters: boolean = false;
  selectedCategory: CategoriaProductoSumary;
  selectedTipoMovimiento: TipoMovimientoInventario;

  constructor(private service: MovimientosInventarioService,
    private _categoriaService: CategoriaProductoService
  ) { }

  createSubscriptions(){
    /*
    this.loading$.subscribe((isLoading: boolean) => {
      this.loading = this._categoriaService.isLoading || this._service.isLoading;
    });
    */
    this._categoriaService.source$.subscribe(result => this.categorias = result);
  }

  ngOnInit() {
    this.sucursalID = 1;
    this._categoriaService.getStockCategories();
    this.service.getTipoMovimientos(res=> this.tipoMovimientos = res);
  }

  onCategoriaChange(categoria: CategoriaProductoSumary){
    this.selectedCategory = categoria;
    if(categoria.nombre === 'All'){
      this.selectedCategory = null;
    }
    this.applyFilters();
  }

  onTipoMovimientoChange(tipo: TipoMovimientoInventario){
    this.selectedTipoMovimiento = tipo;
    if(tipo.nombre === 'All'){
      this.selectedTipoMovimiento = null;
    }
    this.applyFilters();
  }

  onRangoChanged(option: number){
    let fechaInicio = moment(new Date());
    let fechaFin = moment(fechaInicio);

    switch(option){
      case 2:
        fechaInicio.subtract(1, 'days');
        fechaFin.subtract(1, 'days');
        break;
      case 3:
        fechaInicio.subtract(2, 'days');
        fechaFin.subtract(1, 'days');
        break;
      case 4:
        fechaInicio.startOf('isoWeek');
        fechaFin = moment(fechaInicio).add(6, 'days');
        break;
      case 5:
        fechaInicio.subtract('week', 1).startOf('isoWeek');
        fechaFin = moment(fechaInicio).add(6, 'days');
        break;
    }

    this.service.getMovimientos(
      this.sucursalID,
      fechaInicio.toDate(), 
      fechaFin.toDate(), 
      (res: MovimientoInventario[])=> {
        this.movimientos = this.movimientosFull = res;
      });
  }

  applyFilters(){
    this.movimientos = this.movimientosFull.filter(mi => {
      return (this.selectedCategory ? mi.producto.categoriaProductoID === this.selectedCategory.key : true)
        && (this.selectedTipoMovimiento ? mi.tipoMovimiento.key === this.selectedTipoMovimiento.key: true);
    });
  }

  toggleFilters(){
    this.showFilters = !this.showFilters
  }
}
