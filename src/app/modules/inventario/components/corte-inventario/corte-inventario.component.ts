import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { InventarioService } from 'app/modules/inventario/services/inventario.service';
import { CategoriaProductoService } from 'app/modules/producto/services/categoria-producto.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';

import { Inventario } from 'app/modules/inventario/models/inventario.models';
import { CategoriaProductoSumary } from 'app/modules/producto/models/producto.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'app-corte-inventario',
  templateUrl: './corte-inventario.component.html',
  styleUrls: ['./corte-inventario.component.scss'],
  providers: [
    InventarioService,
    CategoriaProductoService,
    DialogBoxService
  ]
})
export class CorteInventarioComponent implements OnInit, OnDestroy, AfterViewInit {

  sucursalID: number;
  categorias: CategoriaProductoSumary[];
  selectedCategory: CategoriaProductoSumary;
  dataSource: TableSource<Inventario>;

  private loading$: Observable<boolean>;
  loading = false;

  @ViewChild('cantidadTemplate') cantidadTemplate: TemplateRef<any>;

  constructor(
    private _service: InventarioService,
    private _categoriaService: CategoriaProductoService,
    private dialog: DialogBoxService
  ) {
    this.dataSource = new TableSource();
    this.dataSource.filter = () => {
      return this.selectedCategory ?
        this.selectedCategory.nombre === 'All' ?
        this.dataSource.data :
        this.dataSource.data.filter(inv => inv.producto.categoriaProductoID === this.selectedCategory.key) : this.dataSource.data;
    };
    // Define Columns
    this.dataSource.columns = [
      new TableColumn('Categoria', 'categoria', (item: Inventario) => item.producto.categoriaProducto ? item.producto.categoriaProducto.nombre : ''),
      new TableColumn('Producto', 'producto', (item: Inventario) => item.producto.nombre),
      new TableColumn('Sistema', 'cantidad_actual', (item: Inventario) => item.cantidad),
      new TableColumn('Fisico', 'cantidad_fisica', (item: Inventario) => item.cantidadFisica ? item.cantidadFisica : 0)
    ];
    // Defines default sort
    this.dataSource.columns[0].sortOrder = 0;
    this.dataSource.columns[0].sortDirection = 'desc';
    this.dataSource.columns[1].sortOrder = 1;
    this.dataSource.columns[1].sortDirection = 'desc';

    // Observer when app is retriving data
    this.loading$ = Observable.merge(this._categoriaService.loading$, this._service.loading$);
  }

  createSubscriptions() {
    this.loading$.subscribe(() => {
      this.loading = this._categoriaService.isLoading || this._service.isLoading;
    });

    this._categoriaService.source$.subscribe(result => this.categorias = result);

    this._service.source$.subscribe(result => {
      this.dataSource.updateDataSource(result);
      this.syncWithLocalCopy();
    });
  }

  ngOnInit() {
    this.sucursalID = 1;
    this.createSubscriptions();
    // Get Initial Data
    this._service.getInventarioActual(this.sucursalID);
    this._categoriaService.getStockCategories();
  }

  ngAfterViewInit() {
    // Set Template for Cantidad Fisica
    this.dataSource.columns[3].columnTemplate = this.cantidadTemplate;
  }

  ngOnDestroy() {
    const workingData = this.dataSource.data.filter(row => row.cantidadFisica);
    if (workingData.length > 0) {
      this.dialog.openDialog('Advertencia!', '¿Desea guardar la informacion capturada?', true, (res) => {
        if (res) {
          localStorage.setItem('inventario', JSON.stringify(workingData));
        } else {
          localStorage.removeItem('inventario');
        }
      });
    }
  }

  syncWithLocalCopy() {
    const data = localStorage.getItem('inventario');
    if (data) {
      this.dialog.openDialog('Informacion', 'Existe informacion del inventario. ¿Desea utilizar esta informacion?', true,
        (res) => {
          if (res) {
            const localInv: Inventario[] = JSON.parse(data);
            localInv.forEach(inv => {
              const item = this.dataSource.data.find(ds => ds.productoID === inv.productoID);
              item.cantidadFisica = inv.cantidadFisica;
            });
          } else { localStorage.removeItem('inventario'); }
        });
    }
  }

  onSave() {
    this._service.realizarCorte(this.sucursalID, this.dataSource.data).subscribe(() => {
      localStorage.removeItem('inventario');
      this.dialog.openDialog('Registro exitoso!', 'El corte se ha guardado con exito.', false);
    });
  }

  onCategoriaChange(cat: CategoriaProductoSumary) {
    this.selectedCategory = cat;
    this.dataSource.applyFilters();
  }
}
