import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';

import { Persona } from 'app/modules/base/models/base.models';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class PersonasService extends GenericService<Persona> implements GenericServiceBase<Persona> {
    constructor(_db: BaseAjaxService) {
        super(_db);
        this.catalogID = 1;
    }

    newInstance() { return new Persona(); }
}