import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
// FireBase
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// Services
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from '../../base/services/base-ajax.service';
import { ProductosService } from '../../producto/services/productos.service';
// Models
import { MarcaArmazon, ModeloArmazon, IModeloArmazon } from '../models/armazon.models';
import { Producto } from '../../producto/models/producto.models';

@Injectable()
export class ModeloArmazonService extends FBGenericService<ModeloArmazon> implements GenericServiceBase<ModeloArmazon> {
    private catalogID = 1100;
    private categoryID = 2;
    // Firebase => SQL relation
    private _fb_fieldID = 100009;

    constructor(_db: AngularFireDatabase,
        private _osDB: BaseAjaxService,
        private _productoService: ProductosService) {
        super(_db);
        super.setListRefURL('armazones/modelos');
    }

    newInstance(): ModeloArmazon { return new ModeloArmazon(); }

    mapData(object) {
        const item = super.mapData(object);
        object = this.setGenericType(object);
        item.marcaID = object.marcaID;
        item.modeloID = object.modeloID;
        item.tipoArmazonID = object.tipoArmazonID;
        item.sku = object.sku;
        // Relations
        item.marca = object.marca;
        if (object.categoria) {
            item.categoria = object.categoria;
        } else {
            item.categoria = item.marca.categoria;
        }
        return item;
    }

    map2Server(item: ModeloArmazon): IModeloArmazon {
        return {
            key: item.key,
            nombre: item.nombre,
            categoria: item.categoria,
            marca: item.marca,
            marcaID: item.marcaID,
            modeloID: item.modeloID,
            tipoArmazonID: item.tipoArmazonID,
            sku: item.sku
        };
    }

    getCatalogItem(id: string, callback) {
        const d2s = `${this._fb_fieldID},${id}`;
        super.getCatalogItem(id, (md: ModeloArmazon) => {
            this._osDB.getAllDataFromCatalog(this.catalogID, d2s)
                .subscribe((results: any[]) => {
                    md.modeloID = results.length > 0 ? results[0].C0 : 0;
                    callback(md);
                });
        });
    }

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

    private createProduct(newValue: ModeloArmazon) {
        const _producto = new Producto(`ARMAZON ${newValue.marca.nombre} - ${newValue.nombre}`);
        _producto.requireProcesamiento = false;
        _producto.categoriaProductoID = this.categoryID;
        _producto.detalleID = newValue.modeloID;
        _producto.SKU = newValue.sku ? newValue.sku : '' ;
        return _producto;
    }

    getProduct(modeloID: number, callback) {
        this._productoService
            .getProductByDetail(modeloID, this.categoryID)
            .subscribe(callback);
    }

    save(_currentValue: ModeloArmazon, _newValue: ModeloArmazon, callback) {
        if (_currentValue.hasChanges(_newValue)) {
            // Asign new data to current data
            _currentValue = Object.assign(_currentValue, _newValue);

            _currentValue.marcaID = _currentValue.marca.key;
            if (!_currentValue.categoria) { _currentValue.categoria = null; }
            if (!_currentValue.sku) {_currentValue.sku = ''; }

            // Create FB Item
            const _fbItem = this.map2Server(_currentValue);
            // Save Modelo on FB
            const retValue: ModeloArmazon = _fbItem.key ?  this.updateCatalogItem(_fbItem) :  this.addCatalogItem(_fbItem);
            // Assign key to FB Item
            _fbItem.key = retValue.key;

            // Add relation to SQL
            const d2s = `${this._fb_fieldID},${retValue.key}~100011,${retValue.nombre}`;
            this._osDB.saveDynamicCatalog(d2s, this.catalogID, _currentValue.modeloID, r => {
                retValue.modeloID = r.C0;
                _fbItem.modeloID = retValue.modeloID;

                // Actualiza el modelo en FB
                this.updateCatalogItem(_fbItem);

                this.getProduct(retValue.modeloID, (prod: Producto) => {
                    const _producto = this.createProduct(retValue);
                    _producto.key = prod.key;
                    this._productoService.save(_producto, data => {
                        callback(retValue);
                    });
                });
            });
        } else {
            callback(_currentValue);
        }
    }

    deleteModelo(modelo: ModeloArmazon, callback) {
        this._productoService.delete(modelo.modeloID).subscribe(() => {
            this.deleteCatalogItem(modelo.key);
            callback();
        });
    }
}
