import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { MarcaArmazon } from '../models/armazon.models';
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { GenericServiceBase } from '../../generic-catalogs/services/generic.service';

@Injectable()
export class MarcaArmazonService extends FBGenericService<MarcaArmazon> implements GenericServiceBase<MarcaArmazon> {

    constructor(_db: AngularFireDatabase) {
        super(_db);
        super.setListRefURL('armazones/marcas');
    }

    mapData(object: any): MarcaArmazon {
        const item: MarcaArmazon = super.mapData(object);
        object = this.setGenericType(object);
        item.categoria = object.categoria;
        return item;
    }

    newInstance() { return new MarcaArmazon(); }

    hasChanges(value1: MarcaArmazon, value2: MarcaArmazon) {
        return value1.nombre !== value2.nombre
            || (value1.categoria && value2.categoria ) ? value1.categoria.key !== value2.categoria.key : true;
    }

    save(_currentValue: MarcaArmazon, _newValue: MarcaArmazon) {
        if (this.hasChanges(_currentValue, _newValue)) {
            _currentValue = Object.assign(_currentValue, _newValue);
            return _currentValue.key ?  this.updateCatalogItem(_currentValue) :  this.addCatalogItem(_currentValue);
        }
    }
}
