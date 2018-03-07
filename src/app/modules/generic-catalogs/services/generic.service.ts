import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { getFields } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';
// Services
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
// Models
import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base//models/base.models';
import { FieldProperty } from 'app/modules/generic-catalogs/models/generic-catalogs.models';
import { MetaDataField } from 'app/modules/generic-catalogs/models/metadata-catalogs.models';
import { AjaxLocalStorage } from 'app/modules/base/models/request.models';

export interface GenericServiceBase<T>{
    save(_newValue: T, _currentValue?: T, callback?);
    newInstance(): T | GenericCatalog;
    mapData(object: any): T;
    mapList?(objects: any[]): T[];
    map2Server?(value: T): any;
}

export interface ChangeResponse<T>{
    oldItem: T;
    newItem: T;
    response: boolean;
}

export abstract class GenericService<T extends BaseGenericCatalog> {
    source$: Subject<T[]> = new Subject();
    loading$: Subject<boolean> = new Subject();
    isLoading = false;
    autoSort = true;
    private n_requests = 0;
    protected source: T[] = [];
    protected storage: AjaxLocalStorage<T>;
    protected catalogID: number;

    constructor( protected db: BaseAjaxService,  storageName?: string,  storageTime?: number) {
        this.loading$.subscribe((next: boolean) => this.isLoading = next);
        this.source$.subscribe(() => this.finishLoading());
        if (storageName) {
            this.storage = new AjaxLocalStorage(storageName, storageTime);
            const localData = this.getLocalData(storageName);
            if (localData) { this.setData(localData, false, storageName, false); }
        }
    }

    mapList(list: any[]): T[] {
        let respond = list.map(p => this.mapData(p));
        if (this.autoSort) { respond = this.baseSort(respond); }
        return respond;
    }
    newInstance(): T | GenericCatalog { return new GenericCatalog(); }
    mapData(data: any): T { return this.mapGenericData(this.newInstance(), data); }

    map2Server(value: T) {
        const fieldsMD = getFields(value);
        return fieldsMD.map(fld => `${fld.key},${value[fld.propertyName]}` ).join('~');
    }

    getByID(ID: number): Observable<T> {
        const item$: Subject<T> = new Subject();
        if (!Number.isNaN(ID)) {
            this.startLoading();
            const currentItem = this.getLocalByID(ID);
            if (currentItem) {
                setTimeout(() => item$.next(currentItem), 100);
            } else {
                return this.db.getDetailedData<T>(this.catalogID, ID)
                .map((result: any) => {
                    const response = result ? this.mapData(result) : null;
                    if (response) { this.setData([response], true); }
                    return response;
                });
            }
        }
        item$.subscribe(() => this.finishLoading);
        return item$.asObservable();
    }

    getList(mapData: boolean = true): void {
        this.getBaseList(() => {
            const $sub = this.db.getAllDataFromCatalog(this.catalogID)
                .subscribe((result: any[]) => {
                    this.setData(mapData ? this.mapList(result) : result);
                    $sub.unsubscribe();
                });
        });
    }

    delete(ID: number, storageName?: string): Observable<T> {
        this.startLoading();
        const response = this.db.removeItem(this.catalogID, ID);
        const $sub = response.subscribe(() => {
            this.setData(this.source.filter((s: T | any) => (s.key ? s.key : s.C0) !== ID), false,  storageName);
            this.finishLoading();
            $sub.unsubscribe();
        });
        return response;
    }

    save(workingItem: T, oldItem: T = null): Observable<T> {
        const respond = this.basicSave(workingItem, (item: T) => {
            const $sub = this.db.saveDynamicCatalog(
                this.map2Server(item),
                this.catalogID,
                item.key)
            .map(item => this.mapData(item))
            .subscribe(item => {
                respond.next(item);
                $sub.unsubscribe();
            });
        }, oldItem);
        respond.subscribe(() => this.finishLoading());
        return respond.asObservable();
    }

    protected startLoading() { if (++this.n_requests > 0 && !this.isLoading) { this.loading$.next(true); }}
    protected finishLoading() { if (--this.n_requests <= 0 && this.isLoading) { this.loading$.next(false); }}

    protected baseSort(list: T[]): T[] {
        return list.sort((v1, v2) => {
            if (v1.hasOwnProperty('nombre')) {
                if (v1['nombre'] < v2['nombre']) { return -1; }
                if (v1['nombre'] > v2['nombre']) { return 1; }
            }
            return 0;
        });
    }

    protected mapGenericData(item: any, data: any) {
        if (data) {
            if (data.C0) { item.key = data.C0; }
            const fieldsMD = getFields(item);
            fieldsMD.forEach(fld => item[fld.propertyName] = data[fld.serverField]);
        }
        return item;
    }

    protected shouldSave(newItem: T, oldItem: T = null): Observable<ChangeResponse<T>> {
        const returnValue: Subject<ChangeResponse<T>> = new Subject();
        let response: ChangeResponse<T> = { newItem: newItem, oldItem: null, response: true };
        if (oldItem) {
            newItem.key = oldItem.key;
            response = this.hasChanges(newItem, oldItem);
        }
        if (newItem.key > 0 && !oldItem) {
            this.getByID(Number(newItem.key))
                .subscribe((currentItem: T) => {
                    if (currentItem) { response = this.hasChanges(newItem, currentItem); }
                    returnValue.next(response);
                });
        } else {
            setTimeout(() => returnValue.next(response), 100);
        }
        return returnValue.asObservable();
    }

    protected basicSave(newItem: T, action: any, oldItem?: T) {
        const respond: Subject<T> = new Subject();
        newItem = Object.assign(this.newInstance(), newItem);
        this.startLoading();
        const $sub = this.shouldSave(newItem, oldItem)
            .subscribe((result: ChangeResponse<T>) => {
                if (result.response) {
                    action(result.newItem);
                } else {
                    respond.next(newItem);
                }
                $sub.unsubscribe();
            });
        const _rsub = respond.subscribe(() => {
            this.finishLoading();
            _rsub.unsubscribe();
        });
        return respond;
    }

    private hasChanges(newItem: T, oldItem: T): ChangeResponse<T> {
        const response: ChangeResponse<T> = { newItem: newItem, oldItem: oldItem, response: true };
        if (oldItem) { if (!oldItem.hasChanges(newItem)) { response.response = false; }}
        return response;
    }

    private getLocalByID(ID: number) {
        const localData: T[] = this.getLocalData();
        if (localData) { return localData.find(item => item.key === ID); }
        return null;
    }

    protected addItem(item: T, storageName?: string) {
        const currentItem = this.getLocalByID(Number(item.key));
        if (currentItem) {
            const localData = this.getLocalData();
            const idx = localData.findIndex(it => it.key === item.key);
            localData[idx] = item;
            this.setData(localData, false, storageName);
        } else {
            this.setData([item], true, storageName);
        }
    }

    protected getBaseList(ajax, storageName?: string, concat: boolean = false) {
        this.startLoading();
        const localData = this.getLocalData(storageName);
        if (localData) {
            this.setData(localData, concat, storageName, false);
        } else {
            ajax();
        }
    }

    protected setData(data: any[], concat: boolean = false, storageName?: string, saveLocal: boolean = true) {
        this.source = concat ? this.source.concat(data) : data;
        this.source$.next(this.source);
        if (saveLocal && this.storage) {
            this.storage.setStorage(data, 0, storageName);
            if (storageName !== this.storage.storageName && concat && saveLocal) {
                this.storage.setStorage(this.source, 0);
            }
        }
    }

    protected getLocalData(storageName?: string): T[] {
        if (this.storage) {
            const storedData = this.storage.getStorage(storageName);
            if (storedData) { return storedData.map((item: T) => Object.assign(this.newInstance(), item)); }
        }
        return null;
    }
}

@Injectable()
export class GenericCatalogService extends GenericService<GenericCatalog> implements GenericServiceBase<GenericCatalog> {

    constructor(_db: BaseAjaxService) { super(_db); }

    setCatalogID(id: number) { this.catalogID = id; }

    fields: MetaDataField[];

    map2Server(value: GenericCatalog) {
        const fieldsMD = getFields(value);
        return fieldsMD.map(fldMD => {
                const fld =  this.fields.find((_fld) => _fld.nombreCorto === fldMD.serverField);
                return `${fld.key},${value[fldMD.propertyName]}`;
            })
            .join('~');
    }

    getByFBKey(key: string) {
        const fmd: FieldProperty = GenericCatalog.prototype['keyFB__dbData'];
        const fld =  this.fields.find((_fld) => _fld.nombreCorto === fmd.serverField);
        return this.db.getAllDataFromCatalog(this.catalogID, `${fld.key},${key}`)
            .map(result => result.map(it => this.mapData(it)));
    }

    save(workingItem: GenericCatalog, oldItem: GenericCatalog = null) {
        const respond = this.basicSave(workingItem, (item: GenericCatalog) => {
            const $sub = this.db.saveDynamicCatalog(
                this.map2Server(item),
                this.catalogID,
                item.key)
            .map(item => this.mapData(item))
            .subscribe(item => {
                respond.next(item);
                $sub.unsubscribe();
            });
        }, oldItem);
        return respond.asObservable();
    }
}
