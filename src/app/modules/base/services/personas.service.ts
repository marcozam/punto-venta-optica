import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';

import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';

import { Persona } from 'app/modules/base/models/base.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class PersonasService extends GenericService<Persona> implements GenericServiceBase<Persona> {
    constructor(_db: BaseAjaxService) {
        super(_db);
        this.catalogID = 1;
    }

    mapData(r){
        let item = new Persona();
        item.key = r.C0;
        item.nombre = r.C1;
        item.apellidoPaterno = r.C2;
        item.apellidoMaterno = r.C3;
        item.fechaNacimiento = moment(r.C4).toDate();
        item.sexo = r.C5;
        return item;
    }

    addCatalogItem(_persona:Persona){
        /*
        if(typeof(_persona.fechaNacimiento) === 'object'){
            _persona.fechaNacimiento = _persona.fechaNacimiento.getTime();
        }
        _persona.apellidoMaterno = _persona.apellidoMaterno.toUpperCase();
        _persona.apellidoPaterno = _persona.apellidoPaterno.toUpperCase();
        _persona.nombre = _persona.nombre.toUpperCase();

        return super.addCatalogItem(_persona);
        */
    }

    hasChanges(value1: Persona, value2: Persona){
        return value1.nombre !== value2.nombre 
            || value1.apellidoPaterno !== value2.apellidoPaterno
            || value1.apellidoMaterno !== value2.apellidoMaterno
            || value1.fechaNacimiento !== value2.fechaNacimiento
            || value1.sexo !== value2.sexo;
    }

    save(_newValue: Persona, _currentValue: Persona, callback){
        let allowSave: boolean = true;
        if(_currentValue){
            allowSave = _currentValue.hasChanges(_newValue);
        }
        if(allowSave)
        {
            let fields = [
                `101,${_newValue.nombre}`,
                `102,${_newValue.apellidoPaterno}`,
                `103,${_newValue.apellidoMaterno}`,
                `104,${_newValue.fechaNacimiento.toJSON()}`,
                `105,${_newValue.sexo}`,
            ]
            let d2s = fields.join('~');
            this.db.saveDynamicCatalog(d2s, this.catalogID, _newValue.key, r => {
                callback(this.mapData(r))
            });
        }
    }
}