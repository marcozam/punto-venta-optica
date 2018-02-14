import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { database } from 'firebase';

import { GenericCatalog } from 'app/modules/base/models/base.models';
import { GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

@Injectable()
export class FBGenericService<T> {

    newInstance() { return new GenericCatalog(); }
    mapList(list: any[]) { return list.map(snap => this.mapData(snap)); }

    mapData(object: any): any {
        object = this.setGenericType(object);
        const item = this.newInstance();
        item.key = object.key;
        item.nombre = object.nombre;
        return item;
    }

    referenceURL: string;
    $listRef: AngularFireList<any>;

    constructor(protected db: AngularFireDatabase) { }

    protected addCatalogItem(_catalogItem) {
        const $key = this.$listRef.push(_catalogItem).key;
        _catalogItem.key = $key;
        return _catalogItem;
    }

    protected updateCatalogItem(_catalogItem) {
        _catalogItem.updatedDate = database.ServerValue.TIMESTAMP;
        this.db.object(this.referenceURL + '/' +  _catalogItem.keyFB ?  _catalogItem.keyFB : _catalogItem.key)
            .update(_catalogItem);
        return _catalogItem;
    }

    // TODO
    protected setGenericType(snap: AngularFireAction<database.DataSnapshot>) {
        return Object.assign(snap.payload.val(), { key: snap.key});
    }

    setListRefURL(_url: string) {
        this.referenceURL = _url;
        this.$listRef = this.db.list(_url);
    }

    getCatalogList(callback: any, watch?: boolean) {
        const $ref = this.$listRef.snapshotChanges()
            .map((arr) => this.mapList(arr))
            .subscribe(r => {
                if (!watch) { $ref.unsubscribe(); }
                callback(r);
            });
        if (watch) { return $ref; }
    }

    getCatalogItem(id: string | number, callback: any) {
        const $ref = this.db.object(this.referenceURL + '/' + id).snapshotChanges()
            .map(snap => this.mapData(snap))
            .subscribe(r => {
                $ref.unsubscribe();
                callback(r);
            });
    }

    deleteCatalogItem(id: string | number) { this.db.object(this.referenceURL + '/' + id).remove(); }

    save(_currentValue, _newValue, callback?) {
        _currentValue = Object.assign(_currentValue, _newValue);
        (_currentValue.keyFB ? _currentValue.keyFB : _currentValue.key) ?  this.updateCatalogItem(_currentValue) :  this.addCatalogItem(_currentValue);
    }
}
