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
import { MarcaArmazon, ModeloArmazon } from '../models/armazon.models';
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
            return arr.map(snap => {
                return this.mapData(snap);
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

    hasChanges(value1: ModeloArmazon, value2: ModeloArmazon) {
        return value1.nombre !== value2.nombre
            || value1.marca.key !== value2.marca.key
            || value1.sku !== value2.sku
            || value1.tipoArmazonID !== value2.tipoArmazonID
            || (value1.categoria ? value1.categoria.key !== value2.categoria.key : true);
    }

    save(_currentValue: ModeloArmazon, _newValue: ModeloArmazon, callback) {
        // if(_currentValue.hasChanges(_newValue))
        _currentValue = Object.assign(_currentValue, _newValue);
        _currentValue.marcaID = _currentValue.marca.key;
        if (!_currentValue.categoria) { _currentValue.categoria = null; }
        if (!_currentValue.sku) {_currentValue.sku = ''; }
        const retValue: ModeloArmazon = _currentValue.key ?  this.updateCatalogItem(_currentValue) :  this.addCatalogItem(_currentValue);
        // Add relation to SQL
        const d2s = `${this._fb_fieldID},${retValue.key}~100011,${retValue.nombre}`;
        this._osDB.saveDynamicCatalog(d2s, this.catalogID, _currentValue.modeloID, r => {
            retValue.modeloID = r.C0;
            this.getProduct(retValue.modeloID, (prod: Producto) => {
                const _producto = this.createProduct(retValue);
                _producto.key = prod.key;
                this._productoService.save(_producto, data => {
                    callback(retValue);
                });
            });
        });
    }

    deleteModelo(modelo: ModeloArmazon, callback) {
        this._productoService.delete(modelo.modeloID).subscribe(() => {
            this.deleteCatalogItem(modelo.key);
            callback();
        });
    }
}
