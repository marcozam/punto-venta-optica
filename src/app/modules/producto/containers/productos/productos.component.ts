import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SuccessTitle, SuccessMessage, WarningTitle, LeaveWarningMessage } from 'app/modules/base/constants/messages.contants';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { CategoriaProductoService } from '../../services/categoria-producto.service';
import { ProductosService } from '../../services/productos.service';
import { CategoriaProductoSumary, Producto } from '../../models/producto.models';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  providers: [ProductosService, CategoriaProductoService, DialogBoxService]
})
export class ProductosComponent implements OnInit {
  productoID: number;
  product: Producto;
  categorias: CategoriaProductoSumary[];

  loading$: Observable<boolean>;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private _service: ProductosService,
    private _categoriasService: CategoriaProductoService,
    private router: Router,
    public dialog: DialogBoxService) {
    this.product = new Producto('');
    this.loading$ = Observable.merge(this._categoriasService.loading$, this._service.loading$);
  }

  createSubscriptions() {
    this.loading$.subscribe(() => {
      this.loading = this._categoriasService.isLoading || this._service.isLoading;
    });
    this._categoriasService.source$.subscribe(result => this.categorias = result);
  }

  ngOnInit() {
    this.productoID = Number(this.route.snapshot.params['id']);

    this.createSubscriptions();
    this._categoriasService.getStandAloneCategories();

    if (this.productoID !== 0) {
      this._service.getByID(this.productoID)
        .subscribe((item: Producto) => this.product = item);
    }
  }

  onCancelar(data: any) {
    if (this.product.hasChanges(data)) {
      this.dialog.openDialog(WarningTitle, LeaveWarningMessage, true, result => {
        if (result) {
          this.router.navigate(['/productos']);
        }
      });
    } else { this.router.navigate(['/productos']); }
  }

  onSave(data: Producto) {
    const workingItem = Object.assign(this.product, data);
    this._service.save(workingItem,
      () => {
        this.router.navigate(['/productos']);
        this.dialog.openDialog(SuccessTitle, SuccessMessage, false);
      },
      () => {},
      `os_producto_categoria-${workingItem.categoriaProductoID}`)
  }
}
