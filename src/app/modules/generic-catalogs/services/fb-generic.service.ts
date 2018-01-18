import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { database } from 'firebase';

import { GenericCatalog } from 'app/modules/base/models/base.models';

@Injectable()
export class FBGenericService {
    referenceURL: string;
    db: AngularFireDatabase;

    $listRef: AngularFireList<any>;

    constructor(_db: AngularFireDatabase) {
        //, _referenceURL: string
        //this.referenceURL = _referenceURL;
        //this.$listRef = _db.list(_referenceURL);
        this.db = _db;
    }

    protected addCatalogItem(_catalogItem){
        let $key = this.$listRef.push(_catalogItem).key;
        _catalogItem.key = $key;
        //.then(data => console.log(data) );
        return _catalogItem;
    }

    protected updateCatalogItem(_catalogItem){
        _catalogItem.updatedDate = database.ServerValue.TIMESTAMP;
        this.db.object(this.referenceURL + '/' + _catalogItem.key).update(_catalogItem);
        return _catalogItem;
    }

    //TODO
    //Return Typed Object
    protected setItemType(item: any){}

    protected setGenericType(snap: AngularFireAction<database.DataSnapshot>){
        return Object.assign(snap.payload.val(), { key: snap.key});
    }

    setListRefURL(_url:string){
        this.referenceURL = _url;
        this.$listRef = this.db.list(_url);
    }

    getCatalogList(callback:any, watch?:boolean){
        let $ref = this.$listRef.snapshotChanges()
            .map((arr) => {
                return arr.map(snap => {
                    return this.setGenericType(snap);
                });
            })
            .subscribe(r=> {
                if(!watch){
                    $ref.unsubscribe();
                }
                callback(r);
            });
        if(watch){
            return $ref;
        }
    }
    
    getCatalogItem(id:string | number, callback:any ){
        let $ref = this.db.object(this.referenceURL + '/' + id).snapshotChanges()
            .map(snap => {
                return this.setGenericType(snap);
            })
            .subscribe(r=> {
                $ref.unsubscribe();
                callback(r);
            });
    }

    deleteCatalogItem(id: string | number){
        this.db.object(this.referenceURL + '/' + id).remove();
    }

    hasChanges(value1, value2){
        return value1.nombre !== value2.nombre;
    }

    save(_currentValue, _newValue, callback?){
        if(this.hasChanges(_currentValue, _newValue))
        {
            _currentValue = Object.assign(_currentValue, _newValue);
            _currentValue.key ?  this.updateCatalogItem(_currentValue) :  this.addCatalogItem(_currentValue);
        }
    }
}