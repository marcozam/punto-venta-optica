import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getFields } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';

import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

import { Persona } from 'app/modules/base/models/base.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class PersonasService extends GenericService<Persona> implements GenericServiceBase<Persona> {

    constructor(_db: BaseAjaxService) {
        super(_db);
        this.catalogID = 1;
    }

    map2Server(value: Persona) {
        const fieldsMD = getFields(value);
        return fieldsMD.map(fld => {
            if (fld.propertyName === 'fechaNacimiento') {
                return `${fld.key},${value[fld.propertyName].toJSON()}`;
            } else {
                return `${fld.key},${value[fld.propertyName]}`;
            }
        }).join('~');
    }

    newInstance() { return new Persona(); }
}
