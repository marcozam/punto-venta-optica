import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { ProductosService } from '../../services/productos.service';
import { CategoriaProductoService } from '../../services/categoria-producto.service';
// Models
import { Producto, CategoriaProductoSumary } from '../../models/producto.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'app-productos',
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.scss'],
  providers: [ProductosService, CategoriaProductoService, DialogBoxService]
})
export class ProductosListComponent implements OnInit {
  // productos: Producto[] = [];
  selectedCategory: CategoriaProductoSumary;
  categorias: CategoriaProductoSumary[];
  dataSource: TableSource<Producto>;
  loading$: Observable<boolean>;
  loading: boolean;

  constructor(
    private router: Router,
    private _service: ProductosService,
    private _categoriaService: CategoriaProductoService,
    public dialog: DialogBoxService) {
      // Creates Data Source
      this.dataSource = new TableSource();
      // Define filter function
      this.dataSource.filter = () => {
        return this.selectedCategory ?
          this.selectedCategory.nombre === 'All' ?
          this.dataSource.data :
          this.dataSource.data.filter(prod => prod.categoriaProductoID === this.selectedCategory.key) : this.dataSource.data;
      };
      // Defines Columns
      this.dataSource.columns = [
        new TableColumn( 'Categoria', 'categoria', (item: Producto) => item.categoriaProducto.nombre ),
        new TableColumn('Producto', 'producto', (item: Producto) => item.nombre)
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

    this._categoriaService.source$.subscribe((result: CategoriaProductoSumary[]) => {
      this.categorias = result;
      let allProducts = [];
      this.categorias.forEach(cat => {
        this._service.getProductsByCategory(Number(cat.key))
          .subscribe((products: Producto[]) => {
            allProducts = allProducts.concat(products.filter(p => {
              const cat = this.categorias.find(c => c.key === p.categoriaProductoID);
              p.categoriaProducto = cat;
              return cat ? true : false;
            }));
            if (products.length > 0) { this.dataSource.updateDataSource(allProducts); }
          });
      });
    });
  }

  ngOnInit() {
    this.createSubscriptions();
    this._categoriaService.getStandAloneCategories();
  }

  onDelete(item: Producto) {
    this._service.delete(Number(item.key)).subscribe(() => this.dataSource.refresh());
  }

  onEdit(item: Producto) { this.router.navigate([`/productos/detail/${item.key}`]); }

  onAdd() { this.router.navigate(['/productos/detail/0']); }

  onCategoriaChange(cat: CategoriaProductoSumary) {
    this.selectedCategory = cat;
    this.dataSource.applyFilters();
  }
}
