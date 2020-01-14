import { Injectable } from '@angular/core';
// Services
import { GenericService } from '../../generic-catalogs/services/generic.service';
import { GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from '../../base/services/base-ajax.service';
import { ProductosService } from '../../producto/services/productos.service';
// Models
import { ModeloArmazon } from '../models/armazon.models'; // IModeloArmazon
// import { Producto } from '../../producto/models/producto.models';
// import { switchMap } from 'rxjs/operators';

@Injectable()
export class ModeloArmazonService extends GenericService<ModeloArmazon> implements GenericServiceBase<ModeloArmazon> {
  catalogID = 1100;
  private categoryID = 2;

  constructor(_db: BaseAjaxService,
    private _productoService: ProductosService) {
    super(_db);
  }

  newInstance(): ModeloArmazon { return new ModeloArmazon(); }

  getCatalogItem(id: string, callback) {
    this.getByID(Number(id)).subscribe(item => callback(item));
  }

  /*
  getModelosByMarca(marcaID: string, callback) {
      const $ref = this.db.list(this.referenceURL, ref =>
          ref.orderByChild('marcaID').equalTo(marcaID)
      ).snapshotChanges()
      .map((arr) => {
          return arr
              .map(snap => this.mapData(snap))
              .sort((v1, v2) => {
                  if (v1.nombre < v2.nombre) { return -1; }
                  if (v1.nombre > v2.nombre) { return 1; }
                  return 0;
              });
      })
      .subscribe(r => {
          callback(r);
          $ref.unsubscribe();
      });
  }
  */

  /*
  private createProduct(newValue: ModeloArmazon) {
      const _producto = new Producto(`ARMAZON ${newValue.marca.nombre} - ${newValue.nombre}`);
      _producto.requireProcesamiento = false;
      _producto.categoriaProductoID = this.categoryID;
      _producto.detalleID = newValue.modeloID;
      _producto.SKU = newValue.sku ? newValue.sku : '' ;
      return _producto;
  }
  */

  getProduct(modeloID: number, callback) {
    this._productoService
      .getProductByDetail(modeloID, this.categoryID)
      .subscribe(callback);
  }

  /*
  save(_currentValue: ModeloArmazon, _newValue: ModeloArmazon) {
    return super.save(_newValue, _currentValue).pipe(
      switchMap(retValue => {
        return this.getProduct(item.modeloID, (prod: Producto) => {
          const _producto = this.createProduct(retValue);
          _producto.key = prod.key;
          this._productoService.save(_producto);
        });
      })
    );
  }
  */

  deleteModelo(modelo: ModeloArmazon, callback) {
    this._productoService.delete(modelo.modeloID).subscribe(() => {
      this.delete(modelo.modeloID).subscribe();
      callback();
    });
  }
}
