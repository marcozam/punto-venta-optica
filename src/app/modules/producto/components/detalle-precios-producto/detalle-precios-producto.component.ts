import { Component, OnInit, Input } from '@angular/core';
import { CategoriaProductoSumary, CategoriaProducto, PrecioProducto } from 'app/modules/producto/models/producto.models';
import { ProductosService } from 'app/modules/producto/services/productos.service';
import { ListaPreciosService } from '../../services/lista-precios.service';
import { CategoriaProductoService } from 'app/modules/producto/services/categoria-producto.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';

@Component({
  selector: 'app-detalle-precios-producto',
  templateUrl: './detalle-precios-producto.component.html',
  styleUrls: ['./detalle-precios-producto.component.scss'],
  providers: [CategoriaProductoService, ProductosService, ListaPreciosService, DialogBoxService]
})
export class DetallePreciosProductoComponent implements OnInit {
  @Input()
  listaPreciosID: number;

  categorias: CategoriaProducto[];
  preciosDetalle: PrecioProducto[];

  constructor(private _service: ProductosService,
    private _categoriaService: CategoriaProductoService,
    private _listaPreciosService: ListaPreciosService,
    public dialog: DialogBoxService) { }

  ngOnInit() {
    // Listen to Categories
    this._categoriaService.source$.subscribe((result: CategoriaProductoSumary[]) => {
      this.categorias = result.map(cat => new CategoriaProducto(cat));
      this.categorias.forEach(cat => {
        this._service.getProductsByCategory(Number(cat.sumary.key))
          .subscribe((products => {
            if (products.length > 0) {
              cat.productos = products.map(prod => {
                const precio = this.preciosDetalle.find(p => p.productoID === prod.key);
                prod.precio = precio ? precio.precio : 0;
                return prod;
              });
            }
          }));
      });
    });

    this._listaPreciosService.getPreciosPreductos(this.listaPreciosID, (precios: PrecioProducto[]) => {
      this.preciosDetalle = precios;
      this._categoriaService.getStandAloneCategories();
    });
  }

  onSave(data) {
    const precios: PrecioProducto[] = [];
    this.categorias.forEach(cat => {
      const pCat = data.productos[cat.sumary.key];
      cat.productos.forEach( prod => {
        const precio = new PrecioProducto(+prod.key);
        precio.listaPreciosID = this.listaPreciosID;
        precio.precio = pCat[prod.key].precio;
        precios.push(precio);
      });
    });
    this._listaPreciosService.setPreciosProductos(this.listaPreciosID, precios, () => {
      this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    });
  }
}
