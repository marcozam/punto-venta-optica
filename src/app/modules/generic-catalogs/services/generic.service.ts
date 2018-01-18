import { Injectable } from '@angular/core';

import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base//models/base.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { Producto } from 'app/modules/producto/models/producto.models';
import { Subject } from 'rxjs';
import { AjaxLocalStorage } from 'app/modules/base/models/request.models';
import { Observable } from 'rxjs/Observable';

export interface GenericServiceBase<T>{
    save(_newValue: T, _currentValue?: T, callback?)
    newInstance(): T
    mapData(object: any): T
    mapList?(objects: any[]): T[]
    map2Server?(value: T): any;
}

export interface ChangeResponse<T>{
    item: T;
    response: boolean;
}

export abstract class GenericService<T extends BaseGenericCatalog> {
    source$: Subject<T[]> = new Subject();
    loading$: Subject<boolean> = new Subject();
    isLoading: boolean = false;
    private n_requests: number = 0;
    protected source: T[] = [];
    protected storage: AjaxLocalStorage<T>;

    protected catalogID: number;
    
    constructor(
        protected db: BaseAjaxService, 
        storageName?: string, 
        storageTime?: number) {
        this.loading$.subscribe((next: boolean)=> this.isLoading = next);
        if(storageName){
            this.storage = new AjaxLocalStorage(storageName, storageTime);
        }
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
        throw Error('Method not implemented');
    }

    newInstance(){
        return null;
    }

    getList(mapData: boolean = true): void {
        this.getBaseList(()=>{
            this.db.getAllDataFromCatalog(this.catalogID)
            .subscribe((result: any[]) => this.setData(mapData ? this.mapList(result) : result));
        });
    }

    addItem(item: T, storageName?: string){
        let currentItem = this.getLocalByID(Number(item.key));
        if(currentItem){
            let localData = this.getLocalData();
            let idx = localData.findIndex(it=> it.key === item.key);
            localData[idx] = item;
            this.setData(localData, false, storageName);
        }
        else this.setData([item], true, storageName);
    }

    private getLocalByID(ID: number){
        let localData: T[] = this.getLocalData();
        if(localData) return localData.find(item=> item.key === ID);
        return null;
    }

    getByID(ID: number): Observable<T> {
        let item$: Subject<T> = new Subject();
        if(!Number.isNaN(ID)) {
            this.startLoading();
            let currentItem = this.getLocalByID(ID);
            if(currentItem){
                setTimeout(()=> item$.next(currentItem), 100);
            }
            else{
                return this.db.getDetailedData<T>(this.catalogID, ID)
                    .map((result: any) => {
                        this.finishLoading();
                        let response = result ? this.mapData(result) : null;
                        if(response) this.setData([response], true);
                        return response;
                    });
            }
        }
        return item$.asObservable();
    }

    delete(ID: number, storageName?: string): Observable<any> {
        this.startLoading();
        let response = this.db.removeItem(this.catalogID, ID);
        response.subscribe(
            result => this.setData(
                this.source.filter((s: GenericCatalog | any) => (s.key ? s.key : s.C0) !== ID),
                false, 
                storageName))
        return response;
    }

    protected getBaseList(ajax, storageName?: string, concat: boolean = false){
        this.startLoading();
        let localData = this.getLocalData(storageName);
        if(localData) this.setData(localData, concat, storageName, false);
        else ajax();
    }

    protected shouldSave(workingItem: T): Observable<ChangeResponse<T>>{
        let returnValue: Subject<ChangeResponse<T>> = new Subject()
        this.getByID(Number(workingItem.key))
            .subscribe((currentItem: T) => {
                let response: ChangeResponse<T> = { item: null, response: true };
                if(currentItem){
                    response.item = currentItem;
                    if(!currentItem.hasChanges(workingItem))
                        response.response = false;
                }
                returnValue.next(response);
            });
        return returnValue.asObservable();
    }

    protected basicSave(workingItem: T, action){
        this.shouldSave(workingItem)
            .subscribe((result: ChangeResponse<T>) => {
                if(result.response){
                    action(workingItem);
                }
                else{
                    action(workingItem);
                }
            });
    }

    protected setData(data: any[], concat: boolean = false, storageName?: string, saveLocal: boolean = true){
        this.finishLoading();
        this.source = concat ? this.source.concat(data) : data;
        this.source$.next(this.source);
        if(saveLocal && this.storage) { 
            this.storage.setStorage(data, 0, storageName);
            if(storageName !== this.storage.storageName && concat && saveLocal) this.storage.setStorage(this.source, 0);
        }
    }

    protected getLocalData(storageName?: string): T[]{
        if(this.storage){
            let storedData = this.storage.getStorage(storageName);
            if(storedData){
                return storedData.map((item: T)=> {
                    return Object.assign(this.newInstance(), item);
                });
            }
        }
        return null;
    }
}

@Injectable()
export class GenericCatalogService extends GenericService<GenericCatalog> implements GenericServiceBase<GenericCatalog> {
    constructor(_db: BaseAjaxService) {
        super(_db);
    }

    mapData(r, instantiate?: boolean): GenericCatalog {
        let item = new GenericCatalog();
        if(r){
            item.key = r.C0;
            item.nombre = r.C1;
        }
        return r || instantiate ? item : null;
    }

    setCatalogID(id: number){
        this.catalogID = id;
    }

    save(workingItem: GenericCatalog, callback){
        this.basicSave(workingItem, (item: GenericCatalog) =>{
            console.log('Algo')
        });
    }
}