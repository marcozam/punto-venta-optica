import { Injectable } from '@angular/core';

import { BaseGenericCatalog, GenericCatalog } from '../models/generic-catalogs.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { Producto } from 'app/modules/producto/models/producto.models';
import { Subject } from 'rxjs';

export interface GenericServiceBase<T>{
    save(_currentValue: T, _newValue: T, callback?)
    mapData(object: any): T
    mapList?(objects: any[]): T[]
    map2Server?(value: T): any
}

export abstract class GenericService<T extends BaseGenericCatalog> {
    source$: Subject<T[]> = new Subject();
    loading$: Subject<boolean> = new Subject();
    isLoading: boolean = false;
    private n_requests: number = 0;

    protected catalogID: number;
    
    constructor(
        protected db: BaseAjaxService, 
        protected storageName?: string, 
        protected storageTime?: number) {
        this.loading$.subscribe((next: boolean)=> this.isLoading = next);
    }

    startLoading(){
        this.n_requests++;
        if(!this.isLoading && this.n_requests > 0){
            this.loading$.next(true);
        }
        //setTimeout(() => {}, 200);
    }

    finishLoading(){
        if(--this.n_requests <= 0 && this.isLoading){
            this.loading$.next(false);
        }
    }

    mapList(list: any[]): T[]{
        return list.map(p=>{
            return this.mapData(p);
        })
    }

    mapData(item: any): T { 
        return null;
    }

    map2Server?(item: T) { }

    getList() {
        this.startLoading();
        this.db.getAllDataFromCatalog(this.catalogID)
            .subscribe((result: any[]) => {
                this.finishLoading();
                this.source$.next(this.mapList(result))
            });
    }
    
    getByID(ID: number) {
        this.startLoading();
        return this.db.getDetailedData<T>(this.catalogID, ID)
            .map((result: any) => {
                this.finishLoading();
                return this.mapData(result);
            })
    }

    delete(ID: number) {
        return this.db.removeItem(this.catalogID, ID);
    }
}

@Injectable()
export class GenericCatalogService extends GenericService<GenericCatalog> implements GenericServiceBase<GenericCatalog> {
    constructor(_db: BaseAjaxService) {
        super(_db);
    }

    mapData(r): GenericCatalog {
        let item = new GenericCatalog();
        item.key = r.C0;
        item.nombre = r.C1;
        return item;
    }

    save(_currentValue: GenericCatalog, _newValue: GenericCatalog, callback?){
        if(_currentValue.hasChanges(_newValue))
        {
            _currentValue = Object.assign(_currentValue, _newValue);
            //TODO
        }
    }
}